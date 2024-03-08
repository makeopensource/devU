import React from 'react'

import { Assignment, Course } from 'devu-shared-modules'

import ListItemWrapper from 'components/shared/layouts/listItemWrapper'

import { prettyPrintDate } from 'utils/date.utils'

import styles from './userAssignmentListItem.scss'

type Props = {

  course: Course
  assignment: Assignment
}

const UserAssignmentListItem = ({assignment}: Props) => (
    <ListItemWrapper to={`/assignments/${assignment.id}`} tag={assignment.name}>
        <div className={styles.name}>{assignment.name}</div>
        <div className={styles.subText}>
            <div>{assignment.description}</div>
            <div>Start Date: {prettyPrintDate(assignment.startDate)}</div>
            <div>Due Date: {prettyPrintDate(assignment.dueDate)}</div>
            <div>End Date: {prettyPrintDate(assignment.endDate)}</div>
            <div>Maximum Submissions: {assignment.maxSubmissions}</div>
        </div>
    </ListItemWrapper>
)
export default UserAssignmentListItem