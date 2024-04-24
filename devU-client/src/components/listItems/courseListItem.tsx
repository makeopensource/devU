import React, {useState} from 'react'

import {Course} from 'devu-shared-modules'

import {prettyPrintDate} from 'utils/date.utils'
import {prettyPrintSemester} from "../../utils/semester.utils";

import styles from './courseListItem.scss'
import {Link} from "react-router-dom";
import ColorHash from "color-hash";

const colorHash = (input: string) => {
    const hash = new ColorHash({hue: {min: 90, max: 270}})

    return hash.hex(input)
}
type Props = {
    course: Course
}

const CourseListItem = ({course}: Props) => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleOpen = () => {

        setIsOpen(!isOpen)
    }

    return (
        <div className={styles.courseContainer} onClick={toggleOpen}>
            <div className={styles.name}>
                <div className={styles.tag} style={{backgroundColor: colorHash(course.number)}}></div>
                <span className={styles.triangle} style={{transform: isOpen ? "rotate(90deg)" : ""}}></span>
                &nbsp;{course.name}
            </div>
            {isOpen &&
                <Link to={`/courses/${course.id}`} className={styles.container}>
                    {infoSection("Course Number", course.number)}
                    {infoSection("Semester", prettyPrintSemester(course.semester))}
                    {infoSection("Start/End Date", prettyPrintDate(course.startDate), prettyPrintDate(course.endDate))}
                </Link>
            }
        </div>
    )
}

const infoSection = (display: string, firstValue: string, secondValue?: string) => (
    <div className={styles.courseInfo}>
        <div className={styles.infoContainer}>
            <span className={styles.info}>{display}:</span>
            <span>{firstValue}{secondValue && `-${secondValue}`}</span>
        </div>
    </div>
)


export default CourseListItem
