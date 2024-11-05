import React, {useState} from 'react'
import {Document, Page} from 'react-pdf'
import { pdfjs } from 'react-pdf';
import PageWrapper from 'components/shared/layouts/pageWrapper'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const TestPage = () => {
    const [file, setFile] = useState<File | null>(null)
    const [numPages, setNumPages] = useState(0)

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0])
        }
    }

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages)
    }

    return (
        <PageWrapper>
            <div style={{maxWidth:"900px", margin:"auto"}}>
            {file && 
                <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                    {[...Array(numPages)].map((_, index) => (
                        <div style={{marginBottom:"20px"}}>
                            <Page key={index} pageNumber={index + 1} renderTextLayer={false} renderAnnotationLayer={false} scale={1.5}/>
                        </div>
                    ))}
                </Document>
            }
            </div>
            <br/>
            <input type="file" onChange={handleFileUpload}/>

        </PageWrapper>
    )
}

export default TestPage