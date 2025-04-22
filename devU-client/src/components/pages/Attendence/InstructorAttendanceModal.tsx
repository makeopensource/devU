import React, { useState } from 'react';
import Modal from 'components/shared/layouts/modal';
import './attendancePage.scss';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    courseInfo: {
      id: string;
      number: string;
      name: string;
      semester: string;
    };
    date: string;
    code: string;
    duration: string;
    description?: string;
  }) => void;
  courseInfo: {
    id: string;
    number: string;
    name: string;
    semester: string;
  };
}

const InstructorAttendanceModal: React.FC<Props> = ({ open, onClose, onSubmit, courseInfo }) => {
  const [date, setDate] = useState('');
  const [code, setCode] = useState('');
  const [duration, setDuration] = useState('15');
  const [description, setDescription] = useState('');

  const handleGenerateCode = () => {
    const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    setCode(randomCode);
  };

  const handleSubmit = () => {
    const attendanceData = {
      courseInfo,
      date,
      code,
      duration,
      description
    };

    console.log('Submitting attendance:', attendanceData);
    onSubmit(attendanceData);
  };

  return (
    <Modal
      title="Create Attendance"
      open={open}
      onClose={onClose}
      buttonAction={handleSubmit}
    >
      <div className="assignment-form"style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="formRow" style={{ display: 'flex', flexDirection: 'column' }}>
          <label>
            <strong>Course:</strong>
          </label>
          <span>
            {courseInfo.number}: {courseInfo.name}
          </span>
        </div>
        
        <div className="formRow" style={{ display: 'flex', flexDirection: 'column' }}>
          <label>Session Date:</label>
          <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          />
        </div>
        
        <div className="formRow" style={{ display: 'flex', flexDirection: 'column' }}>
          <label>Attendance Code:</label>
          <div
          className="code-input-row"
          style={{ display: 'flex', gap: '0.5rem' }}
          >
            <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter or generate a code"
            required
            style={{ flexGrow: 1 }}
            />
            <button
            type="button"
            className="btnPrimary"
            onClick={handleGenerateCode}>
              Generate
              </button>
          </div>
        </div>

        <div className="formRow" style={{ display: 'flex', flexDirection: 'column' }}>
          <label>Duration (minutes):</label>
          <input
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>

        <div className="formRow" style={{ display: 'flex', flexDirection: 'column' }}>
          <label>Description (optional):</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Details for this session"
            rows={3}
          />
        </div>
      </div>
    </Modal>
  );
};

export default InstructorAttendanceModal;
