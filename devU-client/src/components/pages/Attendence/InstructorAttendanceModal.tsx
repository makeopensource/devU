import React, { useState } from 'react';
import Modal from 'components/shared/layouts/modal';
import './attendancePage.scss';

interface Props {
  open: boolean;
  onClose: () => void;
}

const InstructorAttendanceModal: React.FC<Props> = ({ open, onClose }) => {
  const [course, setCourse] = useState('');
  const [date, setDate] = useState('');
  const [code, setCode] = useState('');
  const [duration, setDuration] = useState('15');
  const [description, setDescription] = useState('');

  const handleGenerateCode = () => {
    const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    setCode(randomCode);
  };

  const handleSubmit = () => {
    const attendanceData = { course, date, code, duration, description };
    console.log('Submitting attendance:', attendanceData);
    onClose();
  };

  return (
    <Modal
      title="Create Attendance"
      open={open}
      onClose={onClose}
      buttonAction={handleSubmit}
    >
      <div className="assignment-form">
        <div className="formRow">
          <label>Course:</label>
          <select value={course} onChange={(e) => setCourse(e.target.value)} required>
            <option value="" disabled>Select course</option>
            <option value="CSE 312">CSE 312: Web Applications</option>
            <option value="CSE 443">CSE 443: Software Engineering</option>
            <option value="CSE 331">CSE 331: Algorithms and Complexity</option>
          </select>
        </div>

        <div className="formRow">
          <label>Session Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="formRow">
          <label>Attendance Code:</label>
          <div className="code-input-row">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter or generate a code"
              required
            />
            <button type="button" className="btnPrimary" onClick={handleGenerateCode}>
              Generate
            </button>
          </div>
        </div>

        <div className="formRow">
          <label>Duration (minutes):</label>
          <input
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>

        <div className="formRow">
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
