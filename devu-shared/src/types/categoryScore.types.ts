export type CategoryScore = {
    id?: number
    userId: number
    courseId: number
    category: string
    score: number | null
    letterGrade: LetterGrade
    createdAt?: string
    updatedAt?: string
}

export const letterGrades = [
    'A+',
    'A', 
    'A-', 
    'B+', 
    'B', 
    'B-', 
    'C+', 
    'C',
    'C-',
    'D+',
    'D',
    'D-',
    'F',
    '>F<',
    'FX',
    'I',
    'S',
    'U',
    'W',
] as const
export type LetterGrade = typeof letterGrades[number]