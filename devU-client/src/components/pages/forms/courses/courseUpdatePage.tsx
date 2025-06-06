import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import PageWrapper from 'components/shared/layouts/pageWrapper'

import RequestService from 'services/request.service'
// import 'react-datepicker/dist/react-datepicker.css'

import { ExpressValidationError } from 'devu-shared-modules'

import { useActionless } from 'redux/hooks'
// import TextField from 'components/shared/inputs/textField'
import AutomateDates from './automateDates'
import { SET_ALERT } from 'redux/types/active.types'
import {
    applyMessageToErrorFields,
    removeClassFromField
} from "../../../../utils/textField.utils";

import styles from '../assignments/assignmentUpdatePage.scss'

type UrlParams = {
    courseId: string
}

/* 
copied from devU-shared>src>types>user.types.ts and edited from id? to id 
to ensure number type instead of number|undefined 
*/
type User = {
    id: number
    externalId: string // School's unique identifier (the thing that links to the schools auth)
    email: string
    createdAt?: string
    updatedAt?: string
    preferredName?: string
}


const CourseUpdatePage = ({ }) => {
    const [setAlert] = useActionless(SET_ALERT)
    const history = useHistory()
    const [formData, setFormData] = useState({
        name: '',
        number: '',
        semester: 'f0000',
        isPublic: false
    })
    const [startDate, setStartDate] = useState(new Date().toISOString())
    const [endDate, setEndDate] = useState(new Date().toISOString())
    const [studentEmail, setStudentEmail] = useState("")
    const [emails, setEmails] = useState<string[]>([])
    const [invalidFields, setInvalidFields] = useState(new Map<string, string>())
    const [privateDate, setPrivateDate] = useState(new Date().toISOString().split("T")[0]);

    const { courseId } = useParams() as UrlParams
    useEffect(() => {
        let isMounted = false;
        if (!isMounted) {
            RequestService.get(`/api/courses/${courseId}`).then((res) => {
                setFormData({
                    name: res.name,
                    number: res.number,
                    semester: res.semester,
                    isPublic: res.isPublic
                });
                setStartDate(new Date(res.startDate).toISOString());
                setEndDate(new Date(res.endDate).toISOString());
                setPrivateDate(new Date(res.privateDate).toISOString());
                isMounted = true;
            });
        }
    }, []);

    interface Dates {
        startDate: string;
        endDate: string;
    }

    const handleDatesChange = ({ startDate, endDate }: Dates) => {
        setStartDate(startDate);
        setEndDate(endDate);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id
        const newInvalidFields = removeClassFromField(invalidFields, key)
        setInvalidFields(newInvalidFields)
        const value = e.target.value

        // Update form data based on input field
        if (key === 'studentEmail') {
            setStudentEmail(value)
        } else {
            setFormData(prevState => ({ ...prevState, [key]: value }))
        }
    }
    // const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setFormData(prevState => ({ ...prevState, isPublic: e.target.checked }));
    // };
    // const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => { setStartDate(event.target.value) }
    // const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => { setEndDate(event.target.value) }

    // const handlePrivateDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setPrivateDate(event.target.value);
    // };
    const handleCourseUpdate = () => {
        const finalFormData = {
            name: formData.name,
            number: formData.number,
            semester: formData.semester,
            startDate: startDate,
            endDate: endDate,
            isPublic: formData.isPublic,
            privateDate: privateDate,
        }

        if (!startDate) {
            setAlert({ autoDelete: true, type: 'error', message: 'Please select semester and session' })
            return
        }

        RequestService.put(`/api/courses/${courseId}`, finalFormData)
            .then(() => {
                setAlert({ autoDelete: true, type: 'success', message: 'Course Updated' })
                history.goBack()
            })
            .catch((err: ExpressValidationError[] | Error) => {
                const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message
                const newFields = new Map<string, string>()
                Array.isArray(err) ? err.map((e) => applyMessageToErrorFields(newFields, e.param, e.msg)) : newFields
                setInvalidFields(newFields);
                setAlert({ autoDelete: false, type: 'error', message })
            })
            .finally(() => {
            })
    }

    // update value of file and update parsed values if file uploaded
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files?.[0] || null;
        if (uploadedFile) {
            handleFileUpload(uploadedFile);
        }
    };

    // set array of parsed emails from csv file
    const handleFileUpload = (uploadedFile: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const parsedEmails = parseCSV(text);
            setEmails(parsedEmails); // Store the parsed emails in state
        };
        reader.readAsText(uploadedFile); // Read the file
    };

    // return array of emails
    const parseCSV = (text: string): string[] => {
        const lines = text.split('\n');
        const emails: string[] = [];
        const headers = lines[0].toLowerCase().split(',');

        // Find the index of the email-related fields
        const emailIndex = headers.findIndex(header =>
            ['email', 'e-mail', 'email address', 'e-mail address'].includes(header.trim().toLowerCase())
        );

        if (emailIndex === -1) {
            console.error("Email field not found in CSV file");
            setAlert({ autoDelete: false, type: 'error', message: "Email field not found in CSV file" })
            return [];
        }

        // Extract emails
        for (let i = 1; i < lines.length; i++) {
            const fields = lines[i].split(',');
            const email = fields[emailIndex].trim();
            if (email) {
                emails.push(email);
            }
        }

        console.log("Parsed emails: ", emails);
        return emails;
    };

    const getUserId = async (email: string) => {
        // default return value 0 because userIDs start from 1
        try {
            const res: User[] = await RequestService.get("/api/users/");
            const user: User | undefined = res.find((user: User) => user.email === email);

            if (user) {
                return user.id;
            } else {
                console.log("User not found");
                return 0;
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            return 0;
        }
    }

    const addSingleStudent = async (email: string) => {
        const id = await getUserId(email)

        if (id == 0) {
            setAlert({ autoDelete: false, type: 'error', message: "userID not found" })
            return
        }

        const userCourseData = {
            userId: id,
            courseId: courseId,
            role: 'student',
            dropped: false
        }

        try {
            await RequestService.post(`/api/course/${courseId}/user-courses`, userCourseData)
            setAlert({ autoDelete: true, type: 'success', message: `${email} added to course` })
        } catch (error: any) { // Use any if the error type isn't strictly defined
            const message = error.message || "An unknown error occurred"
            setAlert({ autoDelete: false, type: 'error', message })
        }
    }

    const dropSingleStudent = async (email: string) => {
        const userID = await getUserId(email)

        if (userID == 0) {
            setAlert({ autoDelete: false, type: 'error', message: "userID not found" })
            return
        }

        try {
            await RequestService.delete(`/api/course/${courseId}/user-courses/${userID}`)
            setAlert({ autoDelete: true, type: 'success', message: `${email} dropped from course` })
        } catch (error: any) { // Use any if the error type isn't strictly defined
            const message = error.message || "An unknown error occurred"
            setAlert({ autoDelete: false, type: 'error', message })
        }
    }

    // const addBulkStudent = async (emails: string[]) => {
    //     try {
    //         const reqBody = {
    //             users: emails
    //         }
    //         const res = await RequestService.post(`/api/course/${courseId}/user-courses/students/add`, reqBody)
    //         setAlert({ autoDelete: true, type: 'success', message: res.success })
    //     } catch (error: any) { // Use any if the error type isn't strictly defined
    //         const message = error.message || "An unknown error occurred"
    //         setAlert({ autoDelete: false, type: 'error', message })
    //     }
    // }

    // const dropBulkStudent = async (emails: string[]) => {
    //     try {
    //         const reqBody = {
    //             users: emails
    //         }
    //         const res = await RequestService.post(`/api/course/${courseId}/user-courses/students/drop`, reqBody)
    //         setAlert({ autoDelete: true, type: 'success', message: res.success })
    //     } catch (error: any) { // Use any if the error type isn't strictly defined
    //         const message = error.message || "An unknown error occurred"
    //         setAlert({ autoDelete: false, type: 'error', message })
    //     }
    // }

    const handleAddStudent = () => {
        console.log("emails: ", emails);
        if (emails.length < 1) {
            // if no file inputted then addSingleStudent with email
            console.log("adding single user")
            addSingleStudent(studentEmail)
        } else {
            // if file inputted then call
            console.log("adding multiple users")
            emails.forEach(email => {
                addSingleStudent(email)
            })
            // addBulkStudent(emails)
        }
    }

    const handleDropStudent = () => {
        if (emails.length < 1) {
            // if no file inputted then dropSingleStudent with email
            console.log("dropping single user")
            dropSingleStudent(studentEmail)
        } else {
            // if file inputted then for each email parsed from csv dropSingleStudent
            console.log("dropping multiple users")
            emails.forEach(email => {
                dropSingleStudent(email)
            })
            // dropBulkStudent(emails)
        }
    }

    return (
        <PageWrapper>
            <h1>Update Course Form</h1>
            <div className={styles.grid}>
                <div className={styles.form} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h2>Course Details</h2>
                    <div className="input-group">
                        <label htmlFor="name" className="input-label">Course Title:</label>
                        <input type="text" id="name" onChange={handleChange}
                            placeholder='e.g. Web Applications' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="number" className="input-label">Course Code:</label>
                        <input type="text" id="number" onChange={handleChange}
                            placeholder='e.g. CSE 312' />
                    </div>
                    <AutomateDates onDatesChange={handleDatesChange} />
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button className='btnPrimary' onClick={handleCourseUpdate}>Update Course</button>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h2>Manage Roster</h2>
                    {/* <TextField id='studentEmail' label={"Email"} onChange={handleChange}
                        placeholder='e.g. hartloff@buffalo.edu' invalidated={!!invalidFields.get("studentEmail")} helpText={invalidFields.get("studentEmail")} /> */}
                    <div className="input-group">
                        <label htmlFor="studentEmail" className="input-label">Student Email:</label>
                        <input type="text" id="studentEmail" onChange={handleChange}
                            placeholder='e.g. hartloff@buffalo.edu' />
                    </div>
                    <label htmlFor="addDropFile">Add multiple students by uploading a CSV file below</label>
                    <input type="file" accept='.csv' id="addDropFile" onChange={handleFileChange} />
                    <button className="btnSecondary" style={{ width: 'fit-content' }} onClick={() => {
                        setEmails([]);
                        const fileInput = document.getElementById("addDropFile") as HTMLInputElement | null;
                        // remove file from fileInput
                        if (fileInput) {
                            fileInput.value = "";
                        }
                    }}>Remove file</button>
                    <span>The CSV file must have student emails in an "Email"/"E-mail"/"Email Addresses" column</span>
                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', marginTop: '30px', gap: '1rem' }}>
                        <button className='btnPrimary' onClick={handleAddStudent}>Add</button>
                        <button className='btnDelete' onClick={handleDropStudent}>Drop</button>
                    </div>
                </div>
            </div>
            {/* </div> */}
            {/* </div> */}
        </PageWrapper>
    )
}


export default CourseUpdatePage
