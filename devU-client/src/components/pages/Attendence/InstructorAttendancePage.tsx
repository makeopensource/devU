import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageWrapper from 'components/shared/layouts/pageWrapper';
import InstructorAttendanceModal from './InstructorAttendanceModal';
import RequestService from 'services/request.service';
import './InstructorAttendancePage.scss';

interface Props {}

interface CourseInfo {
  id: string;
  number: string;
  name: string;
  semester: string;
}

interface AttendanceRecord {
  courseInfo: CourseInfo;
  date: string;
  code: string;
  duration: string;
  description?: string;
}

const InstructorAttendancePage: React.FC<Props> = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [modalOpen, setModalOpen] = useState(false);
  const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    if (!courseId) return;

    RequestService.get(`/api/courses/${courseId}`)
      .then(data => {
        setCourseInfo({
          id: data.id,
          number: data.number,
          name: data.name,
          semester: data.semester
        });
      })
      .catch(err => console.error('Error fetching course info:', err));
  }, [courseId]);

  useEffect(() => {
    if (!courseInfo?.id) return;

    RequestService.get(`/api/courses/${courseInfo.id}/attendance`)
      .then(data => setAttendanceRecords(data))
      .catch(err => console.error('Failed to load attendance:', err));
  }, [courseInfo]);

  const saveToCsv = () => {
    const toCSV = [];
    let header = 'Course,Date,Code,Duration (min),Description';
    toCSV.push(header + '\n');

    attendanceRecords.forEach(record => {
      const row = `${record.courseInfo.number}: ${record.courseInfo.name},${record.date},${record.code},${record.duration},${record.description || ''}`;
      toCSV.push(row + '\n');
    });

    let final = 'data:text/csv;charset=utf-8,';
    toCSV.forEach(row => {
      final += row;
    });

    const encodedUri = encodeURI(final);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${courseInfo?.number.replace(" ", '').toLowerCase()}_attendance.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!courseInfo) {
    return <PageWrapper><p style={{ padding: '2rem' }}>Loading course info...</p></PageWrapper>;
  }

  return (
    <PageWrapper>
      <div className="instructor-attendance-page">
        <h2>Instructor Attendance</h2>

        <div className="modal-launcher">
          <button className="btnPrimary" onClick={() => setModalOpen(true)}>
            + Create Attendance
          </button>
          {attendanceRecords.length > 0 && (
            <button className="btnSecondary" onClick={saveToCsv} style={{ marginLeft: '1rem' }}>
              ⬇ Export CSV
            </button>
          )}
        </div>

        <InstructorAttendanceModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={(newSession) => {
            const payload = {
              courseId: courseInfo.id,
              date: newSession.date,
              code: newSession.code,
              duration: newSession.duration,
              description: newSession.description
            };
          
            console.log('Creating attendance with payload:', payload);

            RequestService.post(`/api/attendance`, payload)
    .then((savedSession) => {
      setAttendanceRecords(prev => [
        {
          ...savedSession,
          courseInfo
        },
        ...prev
      ]);
      setModalOpen(false);
    })
    .catch(err => {
      console.error('Failed to save attendance:', err.response?.data || err.message || err);
      alert('Could not create attendance. Please try again.');
    });
}}
          courseInfo={courseInfo}
        />

        <div style={{ marginTop: '2rem' }}>
          {attendanceRecords.length === 0 ? (
            <p className="empty-message">No attendance records yet.</p>
          ) : (
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Code</th>
                  <th>Duration</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((entry, index) => (
                  <tr key={`${entry.code}-${index}`}>
                    <td>{entry.courseInfo.number}: {entry.courseInfo.name}</td>
                    <td>{entry.date}</td>
                    <td>{entry.code}</td>
                    <td>{entry.duration} min</td>
                    <td>{entry.description || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};


export default InstructorAttendancePage;
