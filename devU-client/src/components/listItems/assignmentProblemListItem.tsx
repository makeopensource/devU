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

    const getMeta = () => {
        if (ncags && ncags.length > 0){
            const ncag = ncags.find(ncag => ncag.question == problem.problemName)
            if (!ncag || !ncag.metadata) {
                return undefined
            }
            return JSON.parse(ncag.metadata)
        } 
    }
    const meta = getMeta()
    if (!meta || !meta.type){
        return (<div className={styles.problem}>
            <h4></h4>
        </div>)
    }

    const type = meta.type
    if (type == "Text") {
        return (
        <div key={problem.id} className={styles.problem}>
            <h4 className={styles.problem_header}>{problem.problemName}</h4>
            <TextField className={styles.textField}
                placeholder='Answer'
                onChange={handleChange}
                id={problem.problemName}
                sx={{width: '100%', marginLeft : 1/10}}/>
        </div>
    )} 
    else if(type == "MCQ") {
        const options = meta.options
        if (!options){
            return <div></div>
        }
        return (
            <div key={problem.id} className={styles.problem}>
                <h4 className={styles.problem_header}>{problem.problemName}</h4>
                {Object.keys(options).map((key : string) => (<div key={key}><input type='checkbox'></input> {options[key]}</div>))}
            </div>)
    }
    else {
        return(
            <div>Unknown type, something is wrong on the backend!</div>)
        }
}


export default AssignmentProblemListItem