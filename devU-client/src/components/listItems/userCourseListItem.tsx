import React from 'react'
import { Link } from 'react-router-dom'
import { UserCourse, Course } from 'devu-shared-modules'

import { prettyPrintDate } from 'utils/date.utils'

import styles from './userCourseListItem.scss'

import ColorHash from 'color-hash'

type Props = {
  userCourse: UserCourse
  course: Course
}

const colorHash = (input: string) => {
  const hash = new ColorHash({hue: {min: 90, max: 270}});
  return hash.hex(input);
}

const UserCourseListItem = ({ course }: Props) => (
  <Link to={`/courses/${course.id}`} className={styles.container}>
    <div className={styles.tag} style={{backgroundColor: colorHash(course.number)}}></div>
    <div>
      <div className={styles.name}>{course.name}</div>
      <div className={styles.subText}>
        <div>{course.number}</div>
        <div>Semester: {course.semester}</div>
        <div>Start Date: {prettyPrintDate(course.startDate)}</div>
        <div>End Date: {prettyPrintDate(course.endDate)}</div>

        {/* Add any other class information here */}
      </div>
    </div>
  </Link>
)

export default UserCourseListItem
