import React, {useState} from 'react'
import {Document, Page} from 'react-pdf'
import { pdfjs } from 'react-pdf';
import PageWrapper from 'components/shared/layouts/pageWrapper'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const TestPage = () => {
    const [file, setFile] = useState<File | null>(null)

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0])
        }
    }

    return (
        <PageWrapper>
            {file && 
                <Document file={file}>
                    <Page pageNumber={1} />
                </Document>
            }
            <br/>
            <input type="file" onChange={handleFileUpload}/>

        </PageWrapper>
    )
}

export default TestPage