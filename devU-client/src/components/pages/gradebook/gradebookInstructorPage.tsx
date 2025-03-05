import React, { useEffect, useState } from 'react'

import { Assignment, AssignmentProblem, AssignmentScore, User } from 'devu-shared-modules'

import PageWrapper from 'components/shared/layouts/pageWrapper'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import ErrorPage from '../errorPage/errorPage'
import FaIcon from 'components/shared/icons/faIcon'


import RequestService from 'services/request.service'

import styles from './gradebookPage.scss'
import { useParams } from 'react-router-dom'
import TextField from 'components/shared/inputs/textField'

type TableProps = {
    users: User[]
    assignments: Assignment[]
    assignmentScores: AssignmentScore[]
}
type RowProps = {
    user: User
    assignments: Assignment[]
    assignmentScores: AssignmentScore[]
}
//table for style
const TableRow = ({ user, assignments, assignmentScores }: RowProps) => {

    return (
        <tr className={styles.row}>
                <td className={styles.name}>{user.preferredName ? user.preferredName : "No_Name Available"}</td>
                <td className={styles.email} style={{borderRight: '#ddd 2px solid'}}><a href={`mailto:${user.email}`}>{user.email}</a></td>
            {/* <td>{user.externalId}</td> */}
            
            {assignments.map(a => (
                <td>{assignmentScores.find(as => as.assignmentId === a.id)?.score ?? 'N/A'}</td>
            ))}
        </tr>
    )
}

const GradebookTable = ({ users, assignments, assignmentScores }: TableProps) => {
    return (
        <table>
            <th className={styles.name}>Name</th>
            <th className={styles.email}>Email</th>
            {assignments.map((a) => {
                return (<th>{a.name}</th>)
            })}
            {users.map((u) => (
                <TableRow
                    user={u}
                    assignments={assignments}
                    assignmentScores={assignmentScores.filter(as => as.userId === u.id)}
                />
            ))}
        </table>
    )
}



const GradebookInstructorPage = () => {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [displayedUsers, setDisplayedUsers] = useState(new Array<User>()) //All users in the course
    const [allUsers, setAllUsers] = useState(new Array<User>()) //All users in the course
    //const [userCourses, setUserCourses] = useState(new Array<UserCourse>()) //All user-course connections for the course
    const [allAssignmentProblems, setAllAssignmentProblems] = useState<Map<number, AssignmentProblem[]>>(new Map<number, AssignmentProblem[]>())
    //const [maxScores, setMaxScores] = useState<Map<number, number>>(new Map<number, number>())

    const [assignments, setAssignments] = useState(new Array<Assignment>()) //All assignments in the course
    const [assignmentScores, setAssignmentScores] = useState(new Array<AssignmentScore>()) //All assignment scores for assignments in the course

    const { courseId } = useParams<{ courseId: string }>()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            //const userCourses = await RequestService.get<UserCourse[]>(`/api/course/${courseId}/user-courses/`)
            //setUserCourses(userCourses)

            const users = await RequestService.get<User[]>(`/api/users/course/${courseId}`)
            setAllUsers(users)
            setDisplayedUsers(users)

            const assignments = await RequestService.get<Assignment[]>(`/api/course/${courseId}/assignments`)
            assignments.sort((a, b) => (Date.parse(a.startDate) - Date.parse(b.startDate))) //Sort by assignment's start date
            setAssignments(assignments)

            for(let i : number = 0; i < assignments.length; i++) {
                RequestService.get(`/api/course/${courseId}/assignment/${assignments[i].id}/assignment-problems`)
                    .then((res) => {
                        setAllAssignmentProblems(prevState => {
                            const newMap = new Map(prevState);
                            const list : AssignmentProblem[] = res;
                            newMap.set(Number(assignments[i].id), list);
                            return newMap
                    });
                })
            }
            console.log(allAssignmentProblems);

            const assignmentScores = await RequestService.get<AssignmentScore[]>(`/api/course/${courseId}/assignment-scores`)
            setAssignmentScores(assignmentScores)


        } catch (error: any) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleStudentSearch = (value:string) /*e : React.ChangeEvent<HTMLInputElement>)*/ => {
        console.log("Search term:", value);
        if(value.length === 0){
            setDisplayedUsers(allUsers)
            return;
        }

        console.log("Search term:", value);
        //const search = value.toLowerCase();

        const filterusers = allUsers.filter((user) =>{
            //return(
            console.log(user.preferredName);
            const matchuser =
                user.preferredName?.toLowerCase().includes(value.toLowerCase()) ||
                user.email.toLowerCase().includes(value.toLowerCase())
           // );

            return matchuser;
        });
        console.log("Filtered Users:",filterusers);
        setDisplayedUsers(filterusers);

    };

    if (loading) return <LoadingOverlay delay={250} />
    if (error) return <ErrorPage error={error} />

    return (
        <PageWrapper className={styles.pageWrapper}>
            {/* <div className={styles.header}> */}
            <h1>Instructor Gradebook</h1>
            {/* </div> */}
            <div className={styles.subheader}>
                <div className={styles.key}>Key:  
                    <span className={styles.late}><strong> !</strong> <FaIcon icon='arrow-left'/> Late</span>,&nbsp;
                    <span className={styles.no_submission}><strong>- </strong><FaIcon icon='arrow-left'/> No Submission</span> 
                </div>
                    <TextField
                        onChange={handleStudentSearch}
                        className={styles.textField}                
                        id='name'
                        placeholder='Search students'
                    />
            </div>
            <div className={styles.tableContainer}>
                <GradebookTable
                    users={displayedUsers}
                    assignments={assignments}
                    assignmentScores={assignmentScores}
                />
            </div>
        </PageWrapper>
    )
}

export default GradebookInstructorPage
