export type NonContainerAutoGrader = {
    id?: number
    createdAt?: string
    updatedAt?: string
    assignmentId: number
    question: string
    metadata?: any,
    score:number
    correctString: string
    isRegex: boolean
}