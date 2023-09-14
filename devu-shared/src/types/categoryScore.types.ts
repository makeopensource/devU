export type CategoryScore = {
    id?: number
    userId: number
    courseId: number
    category: string
    score: number | null
    createdAt?: string
    updatedAt?: string
}
