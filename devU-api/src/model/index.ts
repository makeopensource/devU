import AssignmentModel from './assignment.model'
import CourseModel from './course.model'
import SubmissionModel from './submission.model'
import UserModel from './user.model'
import UserCourseModel from './userCourse.model'
import SubmissionProblemScoreModel from './submissionProblemScore.model'
import SubmissionScoreModel from './submissionScore.model'
import CodeAssignmentModel from './codeAssignment.model'

type Models =
  | AssignmentModel
  | CourseModel
  | SubmissionModel
  | UserCourseModel
  | UserModel
  | SubmissionProblemScoreModel
  | SubmissionScoreModel
  | CodeAssignmentModel

export default Models
