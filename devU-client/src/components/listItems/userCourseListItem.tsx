import React from 'react'

import {Assignment, Course} from 'devu-shared-modules'

import ListItemWrapper from 'components/shared/layouts/listItemWrapper'

import {prettyPrintDate} from 'utils/date.utils'

import styles from './userCourseListItem.scss'

import SimpleAssignmentListItem from "./simpleAssignmentListItem";
import {prettyPrintSemester} from "../../utils/semester.utils";

type Props = {
    course: Course
    assignments?: Assignment[]
    past?: boolean
    instructor?: boolean
}

const UserCourseListItem = ({course, assignments, past = false, instructor = false}: Props) => (
    <ListItemWrapper to={`/course/${course.id}`} tag={course.number} containerStyle={styles.container}>

        <div className={styles.name}>{instructor ? (course.name + " (Instructor)") : course.name}</div>
        <div className={styles.subText}>
            <div>{course.number}</div>
            <div>Semester: {prettyPrintSemester(course.semester)}</div>
            <div>Start Date: {prettyPrintDate(course.startDate)}</div>
            <div>End Date: {prettyPrintDate(course.endDate)}</div>

            {assignments && assignments.length > 0 ? (assignments.map((assignment) => (
                <SimpleAssignmentListItem assignment={assignment} key={assignment.id}/>
            ))) : ((past || instructor) ? <div></div> : <div className={styles.name}>No Assignments Due Yet</div>)}

        </div>

    </ListItemWrapper>


)

export default UserCourseListItem
