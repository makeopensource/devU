import React, { ReactNode, useState, useEffect } from 'react'
import { Dialog } from "@mui/material"
import { getCssVariables } from 'utils/theme.utils'

interface ModalProps {
    title: string;
    children: ReactNode;
    buttonAction: () => void;
    open: boolean;
    onClose: () => void;
    isSubmittable?: () => boolean;
}

const Modal = ({ title, children, buttonAction, open, onClose, isSubmittable }: ModalProps) => {
    const [theme, setTheme] = useState(getCssVariables)

    useEffect(() => {
        const observer = new MutationObserver(() => setTheme(getCssVariables()))
        observer.observe(document.body, { attributes: true })
        return () => observer.disconnect()
    })
    return (
        <Dialog open={open} onClose={onClose} className='modal'
            sx={{
                "& .MuiPaper-root": {
                    minWidth: "350px",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    borderRadius: "10px",
                    border: `2px solid ${theme.primary}`,
                    background: theme.modalBackground
                },
            }}>
            <div className='modal-header'>
                <h3> {title} </h3>
                <button onClick={onClose} aria-label='close' title='close' style={{fontWeight:'700px', background: 'none'}}>✕</button>
            </div>
            {children}
            <button onClick={buttonAction} disabled={isSubmittable ? !isSubmittable() : false} className='btnPrimary modalAction'>{title}</button>
        </Dialog>
    )
}

export default Modal;