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
  id: string; // Required ID for records
  isLocal?: boolean; // Flag to identify locally created records
}

const InstructorAttendancePage: React.FC<Props> = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [modalOpen, setModalOpen] = useState(false);
  const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load course info
  useEffect(() => {
    if (!courseId) return;

    setIsLoading(true);
    RequestService.get(`/api/courses/${courseId}`)
      .then(data => {
        const course = {
          id: data.id,
          number: data.number,
          name: data.name,
          semester: data.semester
        };
        setCourseInfo(course);
      })
      .catch(err => {
        console.error('Error fetching course info:', err);
        setIsLoading(false);
      });
  }, [courseId]);

  // Load attendance records - combine API records and localStorage records
  useEffect(() => {
    if (!courseInfo?.id) return;

    // First, get records from API
    RequestService.get(`/api/courses/${courseInfo.id}/attendance`)
      .then(apiRecords => {
        // Make sure API records have IDs
        const formattedApiRecords = apiRecords.map((record: any, index: number) => ({
          ...record,
          id: record.id || `api-${index}-${Date.now()}`
        }));

        // Then, get local records from localStorage
        const localStorageKey = `attendance_${courseInfo.id}`;
        const localRecordsString = localStorage.getItem(localStorageKey);
        let localRecords: AttendanceRecord[] = [];
        
        if (localRecordsString) {
          try {
            localRecords = JSON.parse(localRecordsString);
          } catch (e) {
            console.error('Error parsing local attendance records:', e);
            localStorage.removeItem(localStorageKey); // Clear invalid data
          }
        }

        // Combine and set records
        const allRecords = [...localRecords, ...formattedApiRecords];
        setAttendanceRecords(allRecords);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load attendance from API:', err);
        
        // Still try to load local records on API failure
        const localStorageKey = `attendance_${courseInfo.id}`;
        const localRecordsString = localStorage.getItem(localStorageKey);
        if (localRecordsString) {
          try {
            const localRecords = JSON.parse(localRecordsString);
            setAttendanceRecords(localRecords);
          } catch (e) {
            console.error('Error parsing local attendance records:', e);
          }
        }
        setIsLoading(false);
      });
  }, [courseInfo]);

  // Save local records to localStorage whenever they change
  useEffect(() => {
    if (!courseInfo?.id || attendanceRecords.length === 0) return;

    // Filter out only local records
    const localRecords = attendanceRecords.filter(record => record.isLocal === true);
    if (localRecords.length === 0) return;

    // Save to localStorage
    const localStorageKey = `attendance_${courseInfo.id}`;
    localStorage.setItem(localStorageKey, JSON.stringify(localRecords));
  }, [attendanceRecords, courseInfo]);

  const saveToCsv = () => {
    if (!attendanceRecords.length || !courseInfo) return;
    
    const toCSV = [];
    let header = 'Course,Date,Code,Duration (min),Description';
    toCSV.push(header + '\n');

    attendanceRecords.forEach(record => {
      const row = `"${record.courseInfo.number}: ${record.courseInfo.name}","${record.date}","${record.code}","${record.duration}","${record.description || ''}"`;
      toCSV.push(row + '\n');
    });

    let final = 'data:text/csv;charset=utf-8,';
    toCSV.forEach(row => {
      final += row;
    });

    const encodedUri = encodeURI(final);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${courseInfo.number.replace(/\s+/g, '').toLowerCase()}_attendance.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAttendanceSubmit = (newSession: any) => {
    if (!courseInfo) return;
    
    // Create a new record directly without a POST request
    const newRecord: AttendanceRecord = {
      id: `local-${Date.now()}`, // Generate a unique local ID
      courseInfo: courseInfo,
      date: newSession.date,
      code: newSession.code,
      duration: newSession.duration,
      description: newSession.description,
      isLocal: true // Mark as locally created
    };
    
    // Add the new record to the beginning of the array
    setAttendanceRecords(prev => [newRecord, ...prev]);
    setModalOpen(false);
    
    // Save this record to localStorage immediately
    const localStorageKey = `attendance_${courseInfo.id}`;
    const existingRecordsString = localStorage.getItem(localStorageKey);
    let existingRecords: AttendanceRecord[] = [];
    
    if (existingRecordsString) {
      try {
        existingRecords = JSON.parse(existingRecordsString);
      } catch (e) {
        console.error('Error parsing local attendance records:', e);
      }
    }
    
    localStorage.setItem(localStorageKey, JSON.stringify([newRecord, ...existingRecords]));
    console.log('Attendance record created and saved locally:', newRecord);
  };

  if (isLoading || !courseInfo) {
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
          onSubmit={handleAttendanceSubmit}
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
                {attendanceRecords.map((entry) => (
                  <tr key={entry.id}>
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