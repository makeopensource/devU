import React from 'react'
import { Assignment, Course } from 'devu-shared-modules'
import { useHistory } from "react-router-dom";
import ListItemWrapper from 'components/shared/layouts/listItemWrapper'
import FaIcon from 'components/shared/icons/faIcon'

//import {prettyPrintDate} from 'utils/date.utils'

import styles from './userCourseListItem.scss'

import SimpleAssignmentListItem from "./simpleAssignmentListItem";
//import {prettyPrintSemester} from "../../utils/semester.utils";

type Props = {
    course: Course
    assignments?: Assignment[]
    past?: boolean
    instructor?: boolean
}


const UserCourseListItem = ({ course, assignments, past = false, instructor = false }: Props) => {
    const history = useHistory()
    const currentTime = new Date()
    return (
        <ListItemWrapper to={null} tag={course.number} containerStyle={styles.container}>

            <div className={styles.name}>{instructor ? (course.number + ": " + course.name + " "): course.number + ": " + course.name + " "} 
            {instructor === true && <FaIcon icon='chalkboardUser'/>}

            </div>
            <div className={styles.subText}>
                {assignments && assignments.length > 0 ? (assignments.map((assignment) => (
                    (new Date(assignment.dueDate) > currentTime) && <SimpleAssignmentListItem assignment={assignment} key={assignment.id} />
                ))) : past && <div></div> }
                <div className={styles.Buttons}>
                    <button className={styles.sub_button} onClick={(e) => {
                        e.stopPropagation();
                        history.push(`/course/${course.id}`);
                    }}>COURSE PAGE</button>
                    <button className={styles.sub_button} onClick={(e) => {
                        e.stopPropagation();
                        history.push(`/course/${course.id}/gradebook`);
                    }}>GRADEBOOK</button>
                </div>
            </div>

        </ListItemWrapper>

    );
};
export default UserCourseListItem
