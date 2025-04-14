import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import RequestService from 'services/request.service'
import { AssignmentProblem, NonContainerAutoGrader } from 'devu-shared-modules'

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
            ncags.find(ncag => ncag.question == problem.problemName)
            return undefined // todo metadata moved to assignment problem
        } 
    }
    

    useEffect(() => {
        fetchNcags()
    }, [])

    const meta = getMeta()
    if (!meta){
        return (
        <div className={styles.problem}>
            <div>File Input Problems are not done yet pending backend changes! :D</div>
        </div>)
    }

    const type = null // todo metadata moved
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
                        
                        <span className={styles.checkbox}>
                             <FaIcon icon='check' className={styles.checkboxCheck}/>
                        </span>{/* custom checkbox */}
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
                        name={`${problem.id}_answer`}
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