import React, {useEffect, useState} from 'react'
import {Link, useHistory, useParams} from 'react-router-dom'
import {useAppSelector} from 'redux/hooks'

import {Assignment, AssignmentScore} from 'devu-shared-modules'

import PageWrapper from 'components/shared/layouts/pageWrapper'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import ErrorPage from '../errorPage/errorPage'

import RequestService from 'services/request.service'
import Button from '@mui/material/Button'

import styles from './gradebookPage.scss'

type CategoryProps = {
    categoryName: string
    assignments: Assignment[]
    assignmentScores: AssignmentScore[]
}
type AssignmentProps = {
    assignment: Assignment
    assignmentScore?: AssignmentScore
}


const CategoryAssignment = ({assignment, assignmentScore}: AssignmentProps) => {
    const { courseId } = useParams<{courseId: string}>()


    return (
        <div>
            <Link className={styles.assignmentName}
                  to={`/course/${courseId}/assignment/${assignment.id}`}>{assignment.name} </Link> -
            Score: {assignmentScore?.score ?? 'N/A'}
        </div>
    )
}

const GradebookCategory = ({categoryName, assignments, assignmentScores}: CategoryProps) => {
    return (
        <div>
            <div className={styles.categoryName}>
                {categoryName}
            </div>
            <div>
                {assignments.filter((a) => a.categoryName === categoryName)
                .map((a) => (
                    <CategoryAssignment
                        key={a.id}
                        assignment={a}
                        assignmentScore={assignmentScores.find(aScore => aScore.assignmentId === a.id)}
                    />
                ))}
            </div>
        </div>
    )
    
}

const GradebookStudentPage = () => {
    
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [categories, setCategories] = useState(new Array<string>())
    const [assignments, setAssignments] = useState(new Array<Assignment>())
    const [assignmentScores, setAssignmentScores] = useState(new Array<AssignmentScore>())
    const role = useAppSelector((store) => store.roleMode)
    const { courseId } = useParams<{courseId: string}>()
    const userId = useAppSelector((store) => store.user.id)
    const history = useHistory()
    
    useEffect(() => {
        fetchData()
      }, [])
    
    const fetchData = async () => {
        try {
            const assignments = await RequestService.get<Assignment[]>(`/api/course/${courseId}/assignments/released`)
            setAssignments(assignments)

            const assignmentScores = await RequestService.get<AssignmentScore[]>(`/api/course/${courseId}/assignment-scores/user/${userId}`)
            setAssignmentScores(assignmentScores)

            //As I'm unsure as to how category creation will be handled, this is done for now instead of an api call to /categories/course/{courseId}
            const categories = [... new Set(assignments.map(a => a.categoryName))] //Get all unique categories from assignments
            setCategories(categories)

        } catch (error) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <LoadingOverlay delay={250} />
    if (error) return <ErrorPage error={error} />

    return (
        <PageWrapper>
            <div className={styles.header}>
                <div className={styles.smallLine}></div>
                <h1>Student Gradebook</h1>
                <div className={styles.largeLine}></div>
                <div>
                    {role.isInstructor() &&
                        <Button variant='contained' className={styles.button} onClick={() => {
                            history.push(`/course/${courseId}/gradebook/instructor`)
                        }
                        }>Instructor View</Button>}
                </div>
            </div>
            <div>
                {categories.map((c) => (
                    <GradebookCategory
                        key={c}
                        categoryName={c}
                        assignments={assignments}
                        assignmentScores={assignmentScores}
                    />
                ))}
            </div>
        </PageWrapper>
    )
}

export default GradebookStudentPage
