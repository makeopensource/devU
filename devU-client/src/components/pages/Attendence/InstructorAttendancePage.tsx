import React, { useState } from 'react';
import PageWrapper from 'components/shared/layouts/pageWrapper';
import InstructorAttendanceModal from './InstructorAttendanceModal';

const InstructorAttendancePage = () => {
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <PageWrapper>
      <div style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Instructor Attendance</h2>
        <InstructorAttendanceModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </PageWrapper>
  );
};

export default InstructorAttendancePage;
