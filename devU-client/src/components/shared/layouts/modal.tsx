import React, { ReactNode } from 'react'
import { Dialog, IconButton } from "@mui/material"
import FaIcon from 'components/shared/icons/faIcon'

interface ModalProps {
    title: string;
    children: ReactNode;
    buttonAction: () => void;
    open: boolean;
    onClose: () => void;
}

const Modal = ({ title, children, buttonAction, open, onClose }: ModalProps) => {

    return (
        <Dialog open={open} onClose={onClose} id='modal'
        sx={{
            "& .MuiPaper-root": {
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                borderRadius: "10px",
            },
        }}>
            <div className='modal-header'>
                <h3> {title} </h3>
                <IconButton aria-label="close" onClick={onClose}>
                    <FaIcon icon='times' />
                </IconButton>
            </div>
            {children}
            <button onClick={buttonAction} className='btnPrimary'>{title.toLowerCase()}</button>
        </Dialog>
    )
}

export default Modal;