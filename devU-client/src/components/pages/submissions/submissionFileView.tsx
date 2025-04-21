import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import RequestService from 'services/request.service'
import { Submission } from 'devu-shared-modules'
// import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/TextLayer.css';
import PageWrapper from 'components/shared/layouts/pageWrapper'
import { getToken } from 'utils/authentication.utils'
import PDFViewer from 'components/utils/pdfViewer'

import config from '../../../config'
const proxiedUrls = {
    '/api': `${config.apiUrl}`,
}

function _replaceUrl(userUrl: string) {
    const proxy: string | undefined = Object.keys(proxiedUrls).find((key) => {
        if (userUrl.startsWith(key)) return true
        return false
    })

    if (!proxy) return userUrl

    return userUrl.replace(proxy, proxiedUrls[proxy as keyof typeof proxiedUrls])
}


pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const SubmissionFileView = () => {
    const { courseId, assignmentId, submissionId } = useParams<{ courseId: string, assignmentId: string, submissionId: string }>()
    const [bucket, setBucket] = useState('')
    const [filename, setFilename] = useState('')
    const history = useHistory()
    const authToken = getToken()

    const [file, setFile] = useState<File | Blob | null>(null)

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (bucket && filename) {
            fetchFile()
        }
    }, [bucket, filename])

    const fetchData = async () => {
        try {
            await RequestService.get<Submission>(`/api/course/${courseId}/assignment/${assignmentId}/submissions/${submissionId}`)
                .then((data) => {
                    const submissionFiles = JSON.parse(data.content)
                    const [tempbucket, tempfilename] = submissionFiles.filepaths[0].split('/')
                    setBucket(tempbucket)
                    setFilename(tempfilename)


                })
        } catch (e) {
            console.error(e)
        }
    }

    const fetchFile = async () => {
        try {
            const url = _replaceUrl(`/api/course/${courseId}/file-upload/${bucket}/${filename}`)
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/pdf',
                    'Authorization': `Bearer ${authToken}`,
                },
            })
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
            const file = new File([blob], filename, { type: 'application/pdf' });
            setFile(file);
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <PageWrapper>
            <div className="pageHeader">
                <h1>View Files</h1>
                <button className="pageHeaderBtn" onClick={() => {
                    history.push(`/course/${courseId}/assignment/${assignmentId}`)
                }}>Back to Assignment</button>
            </div>
            <div style={{ maxWidth: "min-content", margin: "auto" }}>
                {file ? (
                    <PDFViewer file={file}/>
                ) : (
                    <p>No files found for this submission</p>
                )}
            </div>
            <br />

        </PageWrapper>
    )

}

export default SubmissionFileView;