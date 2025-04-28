import React, { useState, useRef } from 'react';
import { Document, Page } from 'react-pdf';
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { useAppSelector } from 'redux/hooks'
import styles from "./pdfViewer.scss";

interface PDFWithHighlightProps {
    file: Blob | File;
}

interface Highlight {
    color: string,
    text: string,
    rect: {
        top: number;
        left: number;
        width: number;
        height: number;
    }
}

const PDFViewer: React.FC<PDFWithHighlightProps> = ({ file }) => {
    const [highlights, setHighlights] = useState<Highlight[]>([]);
    const [numPages, setNumPages] = useState(0);
    const [annotate, setAnnotate] = useState(false);
    const [annotationColor, setAnnotationColor] = useState('rgba(0, 225, 255, 0.25)');
    const [annotationBorderColor, setAnnotationBorderColor] = useState('rgba(0, 225, 255, 0.75)');
    const containerRef = useRef<HTMLDivElement | null>(null);
    const role = useAppSelector((store) => store.roleMode)

    const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
    const [currentRect, setCurrentRect] = useState<Highlight['rect'] | null>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        setStartPoint({
            x: e.clientX - containerRect.left,
            y: e.clientY - containerRect.top,
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!startPoint || !containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - containerRect.left;
        const y = e.clientY - containerRect.top;

        const width = Math.abs(x - startPoint.x);
        const height = Math.abs(y - startPoint.y);

        setCurrentRect({
            left: Math.min(x, startPoint.x),
            top: Math.min(y, startPoint.y),
            width,
            height,
        });
    };

    const handleMouseUp = () => {
        if (currentRect) {
            const text = prompt("Enter annotation text:");
            setHighlights((prev) => [
                ...prev,
                {
                    color: annotationColor,
                    rect: currentRect,
                    text: text || "", // Add text to the highlight object
                },
            ]);
        }
        setStartPoint(null);
        setCurrentRect(null);
    };

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages)
    }

    const toggleAnnotate = () => {
        setAnnotate(!annotate);
    }

    const setColors = (e: React.MouseEvent<HTMLButtonElement>) => {
        const computedStyle = window.getComputedStyle(e.currentTarget);
        const color = computedStyle.backgroundColor;
        const borderColor = color.replace("0.25", "0.75");
        console.log(borderColor);

        setAnnotationColor(color);

        // color is in rgba. change the opacity to 0.75
        setAnnotationBorderColor(borderColor);
    }

    return (
        <div className={styles.viewPdfWrapper}>
            <div
                ref={containerRef}
                style={{ position: 'relative' }}
                onMouseDown={annotate ? handleMouseDown : undefined}
                onMouseMove={annotate ? handleMouseMove : undefined}
                onMouseUp={annotate ? handleMouseUp : undefined}
            >
                {/* react-pdf document */}
                <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                >
                    {[...Array(numPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        return (
                            <Page
                                key={pageNumber}
                                pageNumber={pageNumber}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                scale={1.0}
                            />
                        );
                    })}
                </Document>
                {/* Render current rectangle while dragging */}
                {annotate && currentRect && (
                    <div
                        style={{
                            position: 'absolute',
                            left: `${currentRect.left}px`,
                            top: `${currentRect.top}px`,
                            width: `${currentRect.width}px`,
                            height: `${currentRect.height}px`,
                            backgroundColor: annotationColor,
                            border: `2px dashed ${annotationBorderColor}`,
                            pointerEvents: 'none',
                        }}
                    />
                )}
                {/* Show all highlights */}
                {highlights.map((highlight, index) => (
                    <div
                        key={index}
                        style={{
                            position: 'absolute',
                            left: `${highlight.rect.left}px`,
                            top: `${highlight.rect.top}px`,
                            width: `${highlight.rect.width}px`,
                            height: `${highlight.rect.height}px`,
                            backgroundColor: highlight.color,
                            pointerEvents: 'none',
                            textAlign: 'center',
                            padding: '2px',
                        }}
                    ><span style={{ color: '#000', margin: 'auto', fontWeight: '700' }}>{highlight.text}</span></div>
                ))}
            </div>

            {/* annotation options */}
            {console.log("IS INSTRUCTOR:", role.isInstructor())}
            {role.isInstructor() && (<div className={styles.annotationOptions}>
                <button
                    className="btnSecondary"
                    onClick={toggleAnnotate}
                    style={{ whiteSpace: 'nowrap' }}
                >
                    {annotate ? 'Set View Mode' : 'Set Annotate Mode'}
                </button>
                {annotate && (<div className={styles.highlightColors}>
                    <button className={`${styles.colorBtn} ${styles.blue}`} onClick={setColors}>Blue</button>
                    <button className={`${styles.colorBtn} ${styles.green}`} onClick={setColors}>Green</button>
                    <button className={`${styles.colorBtn} ${styles.red}`} onClick={setColors}>Red</button>
                    <button className={`${styles.colorBtn} ${styles.yellow}`} onClick={setColors}>Yellow</button>
                </div>)}
            </div>)}
        </div>
    );
};

export default PDFViewer;
