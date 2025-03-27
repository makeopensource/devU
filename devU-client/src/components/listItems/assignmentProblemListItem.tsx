import React from 'react'

import {AssignmentProblem} from 'devu-shared-modules'

import TextField from 'components/shared/inputs/textField'


import styles from './assignmentProblemListItem.scss'

type Props = {
    problem: AssignmentProblem
    handleChange: (value: string, e : React.ChangeEvent<HTMLInputElement>) => void
}

const AssignmentProblemListItem = ({problem, handleChange}: Props) => {

    return (
        <div key={problem.id} className={styles.problem}>
            <h4 className={styles.problem_header}>{problem.problemName}</h4>
            <TextField className={styles.textField}
                placeholder='Answer'
                onChange={handleChange}
                id={problem.problemName}
                sx={{width: '100%', marginLeft : 1/10}}/>
        </div>
    )
}


export default AssignmentProblemListItem