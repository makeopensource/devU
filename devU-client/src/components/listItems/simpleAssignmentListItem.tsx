import React from 'react'
import ListItemWrapper from 'components/shared/layouts/listItemWrapper'
import {wordPrintDate} from 'utils/date.utils'
import styles from './simpleAssignmentListItem.scss'
import {Assignment} from 'devu-shared-modules'


type Props = {
    assignment: Assignment
}

const SimpleAssignmentListItem = ({assignment}: Props) => (
<div onClick={(e) => (e.stopPropagation())}> {/*Wrapped in div so that clicking this item does not propogate to course cards onClick and take you to course detail page */}
    <ListItemWrapper to={`/course/${assignment.courseId}/assignment/${assignment.id}`} tag={assignment.name}
                     className={styles.title} tagStyle={styles.tag} containerStyle={styles.container}>
        <div className={styles.subText}>{assignment.name}</div>
        <div className={styles.meta}>
            <span style={{fontWeight:'700'}}>Due:&nbsp;</span>{wordPrintDate(assignment.dueDate)}
            <span>&nbsp;|&nbsp;</span>
            <span style={{fontWeight:'700'}}>End:&nbsp;</span>{wordPrintDate(assignment.endDate)}
        </div>
    </ListItemWrapper>
</div>
)


export default SimpleAssignmentListItem