import React, { useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import RequestService from 'services/request.service'
import {AssignmentProblem, NonContainerAutoGrader} from 'devu-shared-modules'

import TextField from 'components/shared/inputs/textField'


import styles from './assignmentProblemListItem.scss'

type Props = {
    problem: AssignmentProblem
    handleChange: (value: string, e : React.ChangeEvent<HTMLInputElement>) => void
}

const AssignmentProblemListItem = ({problem, handleChange}: Props) => {
    const { courseId } = useParams<{ courseId: string }>()
    const [ncags, setNcags] = useState<NonContainerAutoGrader[]>([])
    //const type = ncags.at(0)?.metadata

    const fetchNcags = async() => {
        await RequestService.get(`/api/course/${courseId}/assignment/${problem.assignmentId}/non-container-auto-graders`).then((res) => setNcags(res))
    }

    useEffect(() => {
        fetchNcags()
    }, [])
    useEffect(() => {
        if (ncags && ncags.length > 0){
            console.log(ncags)
            const meta = ncags.at(0)?.metadata // need help here
            console.log(meta)
        }
    }, [ncags])

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