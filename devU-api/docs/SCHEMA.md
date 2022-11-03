# Entities

- [x] [User](#user)
- [x] [Course](#course)
- [x] [UserCourse](#usercourse)
- [x] [Assignment](#assignment)
- [x] [Submission](#submission)
- [x] [AssignmentProblem](#assignmentproblem)
- [ ] [SubmissionProblemScore](#submissionproblemscore)
- [ ] [SubmissionScore](#submissionscore)
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

- courseId: foreign_key
- name: string
- startDate: ?
- dueDate: ?
- endDate: ?
- gradingType: ?
- categoryName: ?
- description: string
- maxFileSize: ?
- maxSubmissions: ?
- disableHandins: boolean

### Submission

- courseId: foreign_key
- assignmentId: foreign_key
- userId: foreign_key
- content: ?
- type: ?
- submitterIp: ?
- submittedBy: ?
- orignalSubmissionId: ?

### AssignmentProblem

- assignmentId: foreign_key
- problemName: ?
- maxScore: ?

**------ Everything above this line exists in the code. Everything below needs to be built ------**

### SubmissionProblemScore

- submissionId: foreign_key
- assignmentProblemId: foreign_key
- score: ?
- feedback: ?
- released: ?

### SubmissionScore

- submissionId: foreign_key
- score: ?
- feedback: ?
- released: ?

### AssignmentScore

- assignmentId: foreign_key
- userId: foreign_key
- score: ?

### CategoryScore

- categoryId: foreign_key
- userId: foreign_key
- _missing attributes_

### Category

- courseId: foreign_key
- _missing attributes_

### CourseScore

- courseId: foreign_key
- userId: foreign_key
- _missing attributes_
