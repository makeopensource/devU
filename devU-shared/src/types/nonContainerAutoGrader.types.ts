export type NonContainerAutoGrader = {
    id?: number
    createdAt?: string
    updatedAt?: string
    assignmentId: number
    question: string
    metadata: string,
    score:number
    correctString: string
    isRegex: boolean
}