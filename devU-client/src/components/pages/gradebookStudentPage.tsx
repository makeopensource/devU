import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'

import { Category, Assignment, AssignmentScore } from 'devu-shared-modules'

import PageWrapper from 'components/shared/layouts/pageWrapper'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import ErrorPage from './errorPage'

import RequestService from 'services/request.service'

import styles from './gradebookPage.scss'
import { useParams } from 'react-router-dom'

type CategoryProps = {
    category: Category
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
            <Link className={styles.assignmentName} to={`/courses/${courseId}/assignments/${assignment.id}`}>{assignment.name} </Link> - Score: {assignmentScore?.score ?? 'N/A'}
        </div>
    )
}

const GradebookCategory = ({category, assignments, assignmentScores}: CategoryProps) => {
    return (
        <div>
            <div className={styles.categoryName}>
                {category.name}
            </div>
            <div>
                {assignments.filter((a) => a.categoryName === category.name)
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
    const [categories, setCategories] = useState(new Array<Category>())
    const [assignments, setAssignments] = useState(new Array<Assignment>())
    const [assignmentScores, setAssignmentScores] = useState(new Array<AssignmentScore>())

    const { courseId } = useParams<{courseId: string}>()
    const userId = useAppSelector((store) => store.user.id)
    
    useEffect(() => {
        fetchData()
      }, [])
    
    const fetchData = async () => {
        try {
            const categories = await RequestService.get<Category[]>( `/api/categories/course/${courseId}` )
            setCategories(categories)

            const assignments = await RequestService.get<Assignment[]>( `/api/assignments/course/${courseId}` )
            setAssignments(assignments)

            const assignmentScores = await RequestService.get<AssignmentScore[]>( `/api/assignment-scores/user/${userId}` )
            setAssignmentScores(assignmentScores)

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
                <h1>Student Gradebook</h1>
            </div>
            <div>
                {categories.map((c) => (
                    <GradebookCategory
                        key={c.id}
                        category={c}
                        assignments={assignments}
                        assignmentScores={assignmentScores}
                    />
                ))}
            </div>
        </PageWrapper>
    )
}

export default GradebookStudentPage
