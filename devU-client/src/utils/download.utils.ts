import { Assignment, User, AssignmentScore } from 'devu-shared-modules';
export function createGradebookCsv(assignments: Assignment[], users: User[], assignmentScores: AssignmentScore[], maxScores: Map<number, number>){
    const toCSV = []
    let header = "externalId,email,preferredName"
    assignments.forEach((assignment) => {header+=`,${assignment.name}`})
    toCSV.push(header + '\n')
    //console.log(header)


    users.forEach((user) => {
        let csvString = `${user.externalId},${user.email},${user.preferredName ?? "N/A"}`
        //console.log(csvString)
        assignments.forEach((assignment) => {
            const assignmentScore = assignmentScores.find(as => as.assignmentId === assignment?.id && as.userId == user.id) 
            if (assignment?.id && assignmentScore){ // Submission defined, so...
                csvString += `,${assignmentScore.score}`
            }
            else if (assignment?.id && maxScores.has(assignment?.id)){  // No submission, but there are assignmentproblems defined
                csvString += ',0';
            }
            else{ // No problems mapped to this assignment, so there is no max score.
                csvString += ',N/A';
            }
        })
        toCSV.push(csvString + '\n')
    })
    let final = 'data:text/csv;charset=utf-8,'
    toCSV.forEach((row)=>{final += row})
    return encodeURI(final)
}