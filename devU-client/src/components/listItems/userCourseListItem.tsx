import React from 'react'

import {Assignment, Course} from 'devu-shared-modules'

import ListItemWrapper from 'components/shared/layouts/listItemWrapper'

import {prettyPrintDate} from 'utils/date.utils'

import styles from './userCourseListItem.scss'

import SimpleAssignmentListItem from "./simpleAssignmentListItem";

type Props = {
    course: Course
    assignments?: Assignment[]
}

const UserCourseListItem = ({ course }: Props) => (
  <ListItemWrapper to={`/courses/${course.id}`} tag={course.number}>
    <div className={styles.name}>{course.name}</div>
    <div className={styles.subText}>
      <div>{course.number}</div>
      <div>Semester: {course.semester}</div>
      <div>Start Date: {prettyPrintDate(course.startDate)}</div>
      <div>End Date: {prettyPrintDate(course.endDate)}</div>

      {/* Add any other class information here */}
    </div>
  </ListItemWrapper>
)

export default UserCourseListItem
