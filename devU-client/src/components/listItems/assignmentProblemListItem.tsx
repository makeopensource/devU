import React, { useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import RequestService from 'services/request.service'
import {AssignmentProblem, NonContainerAutoGrader} from 'devu-shared-modules'

import styles from './assignmentProblemListItem.scss'
import FaIcon from 'components/shared/icons/faIcon'

type Props = {
    problem: AssignmentProblem
    handleChange?: (e : React.ChangeEvent<HTMLInputElement>) => void
    disabled?: boolean
}

const AssignmentProblemListItem = ({problem, handleChange, disabled}: Props) => {
    const { courseId } = useParams<{ courseId: string }>()
    const [ncags, setNcags] = useState<NonContainerAutoGrader[]>([])

    //const type = ncags.at(0)?.metadata

    const fetchNcags = async() => {
        await RequestService.get(`/api/course/${courseId}/assignment/${problem.assignmentId}/non-container-auto-graders`).then((res) => setNcags(res))
    }

    const getMeta = () => {
        if (ncags && ncags.length > 0){
            const ncag = ncags.find(ncag => ((ncag.question == problem.problemName) && (ncag.createdAt === problem.createdAt))) // currently checking against createdAt since if two non-code questions have the same name they can be confused otherwise, can be removed once meta string added to assignemntproblem
            if (!ncag || !ncag.metadata) {
                return undefined
            }
            return JSON.parse(ncag.metadata)
        } 
    }
    

    useEffect(() => {
        fetchNcags()
    }, [])

    const meta = getMeta()
    if (!meta || !meta.type){
        return (
        <div className={styles.problem}>
            <div>File Input Problems are not done yet pending backend changes! :D</div>
        </div>)
    }

    const type = meta.type
    if (type == "Text") {
        return (
        <div key={problem.id} className={styles.problem}>
            <h4 className={styles.problem_header}>{problem.problemName}</h4>
            <input className={styles.textField}
                type='text'
                placeholder='Answer'
                onChange={handleChange ?? undefined}
                disabled={disabled ?? false}
                
                id={problem.problemName}
                />
        </div>
    )} else if(type == "MCQ-mult") {
        const options = meta.options
        if (!options){
            return <div></div>
        }
        return (
            <div key={problem.id} className={styles.problem}>
                <h4 className={styles.problem_header}>{problem.problemName}</h4>
                {Object.keys(options).map((key : string) => (
                    <label key={key} className={styles.mcqLabel} style={disabled ? {cursor: 'default'} : undefined}>
                        <input id={problem.problemName} 
                        type='checkbox' 
                        value={key}
                        onChange={handleChange} 
                        disabled={disabled ?? false}/> {options[key]}

                        <span className={styles.checkbox}><FaIcon icon='check' className={styles.checkboxCheck}/></span>{/* custom checkbox */}
                    </label>))}
            </div>)
    } else if(type == "MCQ-single") {
        const options = meta.options
        if (!options){
            return <div></div>
        }
        return (
            <div key={problem.id} className={styles.problem}>
                <h4 className={styles.problem_header}>{problem.problemName}</h4>
                {Object.keys(options).map((key : string) => (
                    <label key={key} className={styles.mcqLabel} style={disabled ? {cursor: 'default'} : undefined}>
                        <input id={problem.problemName} 
                        type='radio' 
                        name='correct'
                        value={key}
                        onChange={handleChange} 
                        disabled={disabled ?? false}/> {options[key]}
                        <span className={styles.radio}></span>{/* custom radio button */}
                    </label>))}
            </div>)
    } else {
        return(
            <div>Unknown type, something is wrong on the backend!</div>)
        }
}


export default AssignmentProblemListItem