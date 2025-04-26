export type NonContainerAutoGrader = {
    id?: number
    createdAt?: string
    updatedAt?: string
    assignmentId: number
    question: string
    score:number
    correctString: string
    isRegex: boolean
}