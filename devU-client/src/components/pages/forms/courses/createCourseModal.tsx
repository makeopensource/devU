import React, { useState } from 'react'

import Modal from 'components/shared/layouts/modal'

interface Props {
    open: boolean;
    onClose: () => void;
}

const CreateCourseModal = ({ open, onClose }: Props) => {
    const handleSubmit = () => {

    }
    return (
        <Modal title="Add Assignment" buttonAction={handleSubmit} open={open} onClose={onClose}>
            <></>
        </Modal>
    )
}

export default CreateCourseModal;