import { Role } from 'devu-shared-modules'

import RoleModel from './role.model'

export function serialize(role: RoleModel): Role {
  return {
    id: role.id,
    createdAt: role.createdAt.toISOString(),
    updatedAt: role.updatedAt.toISOString(),
    name: role.name,

    enrolled: role.enrolled,
    courseEdit: role.courseEdit,
    courseView: role.courseView,
    assignmentViewAll: role.assignmentViewAll,
    assignmentEditAll: role.assignmentEditAll,
    assignmentViewReleased: role.assignmentViewReleased,
    scoresViewAll: role.scoresViewAll,
    scoresEditAll: role.scoresEditAll,
    scoresViewSelfReleased: role.scoresViewSelfReleased,
    roleEditAll: role.roleEditAll,
    roleViewAll: role.roleViewAll,
    roleViewSelf: role.roleViewSelf,
    submissionCreateAll: role.submissionCreateAll,
    submissionChangeState: role.submissionChangeState,
    submissionCreateSelf: role.submissionCreateSelf,
    submissionViewAll: role.submissionViewAll,
    userCourseEditAll: role.userCourseEditAll,
  }
}

// courseEdit: boolean
// assignmentViewAll: boolean
// assignmentEditAll: boolean
// assignmentViewReleased: boolean
// scoresViewAll: boolean
// scoresEditAll: boolean
// scoresViewSelfReleased: boolean
// roleEditAll: boolean
// roleViewAll: boolean
// roleViewSelf: boolean
// submissionCreateAll: boolean
// submissionChangeState: boolean
// submissionCreateSelf: boolean
// usercourseEditAll: boolean
//
// const x = 'name'
// const y = ['course_edit','assignment_view_all','assignment_edit_all','assignment_view_release','scores_view_all','scores_edit_all','scores_view_self_released','role_edit_all','role_view_all','role_view_self','submission_create_all','submission_change_state','submission_create_self', 'usercourse_edit_all']
//
// console.log(x, y)