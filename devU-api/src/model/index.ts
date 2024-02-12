import AssignmentModel from '../assignment/assignment.model'
import CourseModel from '../course/course.model'
import SubmissionModel from '../submission/submission.model'
import UserModel from '../user/user.model'
import UserCourseModel from '../userCourse/userCourse.model'
import SubmissionProblemScoreModel from '../submissionProblemScore/submissionProblemScore.model'
import SubmissionScoreModel from '../submissionScore/submissionScore.model'
import CodeAssignmentModel from '../codeAssignment/codeAssignment.model'
import NonContainerAutoGraderModel from '../nonContainerAutoGrader/nonContainerAutoGrader.model'

type Models =
  | AssignmentModel
  | CourseModel
  | SubmissionModel
  | UserCourseModel
  | UserModel
  | SubmissionProblemScoreModel
  | SubmissionScoreModel
  | CodeAssignmentModel
  | NonContainerAutoGraderModel

export default Models
