import React, { useEffect, useState } from 'react'

import { Assignment, AssignmentProblem, AssignmentScore, User } from 'devu-shared-modules'

import PageWrapper from 'components/shared/layouts/pageWrapper'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import ErrorPage from '../errorPage/errorPage'
import FaIcon from 'components/shared/icons/faIcon'


import RequestService from 'services/request.service'

import styles from './gradebookInstructorPage.scss'
import { useParams, useHistory } from 'react-router-dom'

import TextField from 'components/shared/inputs/textField'
import Dropdown, { Option } from 'components/shared/inputs/dropdown'

type TableProps = {
    users: User[]
    assignments: Assignment[]
    assignmentScores: AssignmentScore[]
    maxScores: Map<number, number>
}

type RowProps = {
    user: User
    assignments: Assignment[]
    assignmentScores: AssignmentScore[]
    maxScores: Map<number, number>
}

//table for style
const TableRow = ({ user, assignments, assignmentScores, maxScores }: RowProps) => {

    return (
        <tr className={styles.row}>
                {user.preferredName ? <td className={styles.name} key={user.preferredName}>{user.preferredName}</td> : <td className={styles.noName}>No Name Set</td>}
                <td className={styles.email} key={user.email} style={{borderRight: '#ddd 2px solid'}}><a href={`mailto:${user.email}`}>{user.email}</a></td>
            
            {assignments.map(a => (
                assignmentScores.find(as => as.assignmentId === a.id)?.score ? <td >{assignmentScores.find(as => as.assignmentId === a.id)?.score}</td> :// If there's a submission, display that grade
                    ((a.id && maxScores.has(a.id)) ?  <td className={styles.no_submission} >0/{maxScores.get(a.id)} <strong>-</strong></td> // Otherwise, check if the assignment has problems and show score as 0/Max(NoSubmissions), if it has no problems, show N/A.
                        : <td>N/A</td>) 
            ))}
        </tr>
    )
}

const GradebookTable = ({ users, assignments, assignmentScores, maxScores }: TableProps) => {
    return (
        <table>
            <thead>
                <tr>
                    <th className={styles.name} key='name_head'>Name</th>
                    <th className={styles.email} key='email_head'>Email</th>
                    {assignments.map((a) => {
                        return (<th key={a.id + "_head"}>{a.name}</th>)
                    })}
                </tr>
            </thead>
            <tbody>
            {users.map((u) => (
                <TableRow
                    user={u}
                    assignments={assignments}
                    assignmentScores={assignmentScores.filter(as => as.userId === u.id)}
                    maxScores={maxScores}
                />
            ))}
            </tbody>
        </table>
    )
}



const GradebookInstructorPage = () => {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [displayedUsers, setDisplayedUsers] = useState(new Array<User>()) //All users in the course
    const [allUsers, setAllUsers] = useState(new Array<User>()) //All users in the course
    //const [userCourses, setUserCourses] = useState(new Array<UserCourse>()) //All user-course connections for the course
    const [assignmentProblems, setAssignmentProblems] = useState<Map<number, AssignmentProblem[]>>(new Map<number, AssignmentProblem[]>())
    const [maxScores, setMaxScores] = useState<Map<number, number>>(new Map<number, number>())
    const [categoryOptions, setAllCategoryOptions] = useState<Option<String>[]>([])

    const [assignments, setAssignments] = useState(new Array<Assignment>()) //All assignments in the course
    const [displayedAssignments, setDisplayedAssignments] = useState(new Array<Assignment>()) //All assignments in the course
    const [assignmentScores, setAssignmentScores] = useState(new Array<AssignmentScore>()) //All assignment scores for assignments in the course
    const { courseId } = useParams<{ courseId: string }>()

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => { // get all assignment problems, map assignment ID to array containing its problems
        for(let i : number = 0; i < assignments.length; i++) {
            RequestService.get(`/api/course/${courseId}/assignment/${assignments[i].id}/assignment-problems`)
               .then((res) => {
                   setAssignmentProblems(prevState => {
                       const newMap = new Map(prevState);
                       newMap.set(Number(assignments[i].id), res);
                       return newMap
               });
           })
    }}, [assignments]);

    useEffect(() => { // add all maxScores of assignment problems to create a maxScore for the entire assignment
        for (let [assignmentId, problems] of assignmentProblems.entries()) {             
            if (problems.length != 0) { // only show possible score for assignments which have problems defined.
                const maxScore = problems.reduce((sum, problem) => sum + problem.maxScore, 0);
                    setMaxScores(prevState => {
                            const newMap = new Map(prevState);
                            newMap.set(assignmentId, maxScore);
                            return newMap;
                    });
                }
        }  
       }
    , [assignmentProblems]);

    useEffect(() => {
        const categories = [...new Set(assignments.map(a => a.categoryName))];
        const options = categories.map((category) => ({
            value: category,
            label: category
          }));
        
        setAllCategoryOptions(options);
    }
        , [assignments])

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
            setDisplayedAssignments(assignments)

            const assignmentScores = await RequestService.get<AssignmentScore[]>(`/api/course/${courseId}/assignment-scores`)
            setAssignmentScores(assignmentScores)


        } catch (error: any) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleStudentSearch = (value:string)  => {
        if(value.length === 0){
            setDisplayedUsers(allUsers)
            return;
        }

        //const search = value.toLowerCase();

        const filterusers = allUsers.filter((user) =>{
            const matchuser =
                user.preferredName?.toLowerCase().includes(value.toLowerCase()) ||
                user.email.toLowerCase().includes(value.toLowerCase())
            return matchuser;
        });
        setDisplayedUsers(filterusers);

    };

    const handleCategoryChange = (value:Option<String>)  => {
        if(!value){
            setDisplayedAssignments(assignments)
            return;
        }
        const label = value.label;


        const filterAssignments = assignments.filter((a) =>{
            const matchuser = a.categoryName === label;
            return matchuser;
        });
        setDisplayedAssignments(filterAssignments);

    };

    
    if (loading) return <LoadingOverlay delay={250} />
    if (error) return <ErrorPage error={error} />

    const history = useHistory();

    //setAllCategoryOptions(categories.map((cat) => ({label: cat, value: String(cat)})));

    return (
        <PageWrapper className={styles.pageWrapper}>
            <div className={styles.header}> 
                <h1 className={styles.pageTitle}>Instructor Gradebook</h1>
                <div className={styles.buttonContainer}>
                    <button className='btnSecondary' id='createCoursBtn' onClick={() => {
                        history.push(`/course/${courseId}/gradebook`)
                    }}>Student View</button>
                    <button className='btnPrimary' id='backToCourse' onClick={() => {
                        history.goBack();
                    }}>Back to Course</button>
                </div>
            </div>
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
                    <Dropdown
                    className={styles.dropdown}
                    options={categoryOptions}
                    onChange={handleCategoryChange}/>
                    
            </div>
            <div className={styles.tableContainer}>
                <GradebookTable
                    users={displayedUsers}
                    assignments={displayedAssignments}
                    assignmentScores={assignmentScores}
                    maxScores={maxScores}
                />
            </div>
        </PageWrapper>
    )
}

export default GradebookInstructorPage
