import React, { ReactNode, useState, useEffect } from 'react'
import { Dialog } from "@mui/material"
import { getCssVariables } from 'utils/theme.utils'

interface ModalProps {
    title: string;
    children: ReactNode;
    buttonAction: () => void;
    open: boolean;
    onClose: () => void;
}

const Modal = ({ title, children, buttonAction, open, onClose }: ModalProps) => {
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
                <button onClick={onClose} aria-label='close' title='close'>✕</button>
            </div>
            {children}
            <button onClick={buttonAction} className='btnPrimary modalAction'>{title.toLowerCase()}</button>
        </Dialog>
    )
}

export default Modal;