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
}

const UserCourseListItem = ({course, assignments}: Props) => (
    <ListItemWrapper to={`/course/${course.id}`} tag={course.number} containerStyle={styles.container}>

        <div className={styles.name}>{course.name}</div>
        <div className={styles.subText}>
            <div>{course.number}</div>
            <div>Semester: {prettyPrintSemester(course.semester)}</div>
            <div>Start Date: {prettyPrintDate(course.startDate)}</div>
            <div>End Date: {prettyPrintDate(course.endDate)}</div>

            {assignments && assignments.length > 0 ? (assignments.map((assignment) => (
                <SimpleAssignmentListItem assignment={assignment} key={assignment.id}/>
            ))) : (<div className={styles.name}>No Assignments Due Yet</div>)}

    </div>

    </ListItemWrapper>


)

export default UserCourseListItem
