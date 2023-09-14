# Entities

- [x] [User](#user)
- [x] [Course](#course)
- [x] [UserCourse](#usercourse)
- [x] [Assignment](#assignment)
- [x] [Submission](#submission)
- [x] [AssignmentProblem](#assignmentproblem)
- [x] [SubmissionProblemScore](#submissionproblemscore)
- [x] [SubmissionScore](#submissionscore)
- [ ] [AssignmentScore](#assignmentscore)
- [ ] [CategoryScore](#categoryscore)
- [ ] [Category](#category)
- [ ] [CourseScore](#coursescore)

# Entity Details

### Generic Entity Attributes

- id
- createdAt
- updatedAt
- deletedAt

### User

_Student user for devu_

- email: string
- externalId: foreign_key
- preferredName: string

### Course

- name: string
- semester: string
- number: string _ex: cse220_
- startDate: ?
- endDate: ?

### UserCourse

_Links a user to a course_

- userId: foreign_key
- courseId: foreign_key
- level: ?
- dropped: boolean

### Assignment

- courseId: foreign_key ManyToOne -> Course
- name: string
- startDate: Date
- dueDate: Date
- endDate: Date
- gradingType: GradingType
- categoryName: string
- description: string | null
- maxFileSize: number
- maxSubmissions: number | null
- disableHandins: boolean

### Submission

- courseId: foreign_key ManyToOne -> Course
- assignmentId: foreign_key -> ManyToOne -> Assignment
- userId: foreign_key -> ManyToOne -> User
- content: string
- type: SubmissionType
- submitterIp: string
- submittedBy: number
- orignalSubmissionId: number | null

### AssignmentProblem

- assignmentId: foreign_key ManyToOne -> Assignment
- problemName: string
- maxScore: number
- createdAt: Date
- updatedAt: Date
- deletedAt: ?Date

### SubmissionProblemScore
- submissionProblemScoreId: number (primary_key) 
- submissionId: foreign_key ManyToOne -> submission
- assignmentProblemId: foreign_key ManyToOne -> AssignmentProblem
- createdAt: Date
- updatedAt: Date
- deletedAt?: Date
- score: number | null
- feedback: string | null
- releasedAt?: Dated

### SubmissionScore

- submissionScoreId: number (primary_key)
- submissionId: foreign_key
- score: number | null
- createAt: Date
- updatedAt: Date
- delatedAt?: Date
- feedback: string | null
- releasedAt?: Date


### Category

- courseId: foreign_key
- name: string

**------ Everything above this line exists in the code. Everything below needs to be built ------**

### AssignmentScore

- assignmentId: foreign_key
- userId: foreign_key
- score: ?


### CategoryScore

- courseId: foreign_key
- userId: foreign_key
- category: string
- score: ?

### CourseScore

- courseId: foreign_key
- userId: foreign_key
- score: ?
- letterGrade: string
