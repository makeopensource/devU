import React from 'react'
import { Switch, Route } from 'react-router-dom'

import AssignmentDetailPage from 'components/pages/assignmentDetailPage'

import AssignmentCreatePage from 'components/pages/assignmentFormPage'
import AssignmentUpdatePage from 'components/pages/assignmentUpdatePage'

import CourseAssignmentsListPage from 'components/pages/courseAssignmentsListPage'
import CourseDetailPage from 'components/pages/courseDetailPage'

import EditCourseFormPage from 'components/pages/coursesFormPage'

import CoursesListPage from 'components/pages/coursesListPage'
import CourseUpdatePage from 'components/pages/courseUpdatePage'
import CourseUsersListPage from 'components/pages/courseUsersListPage'
import HomePage from 'components/pages/homePage'
import NotFoundPage from 'components/pages/notFoundPage'
import SubmissionDetailPage from 'components/pages/submissionDetailPage'
import UserDetailPage from 'components/pages/userDetailPage'
import UserCoursesListPage from 'components/pages/userCoursesListPage'
import UserSubmissionsListPage from 'components/pages/userSubmissionsListPage'
import GradebookStudentPage from './pages/gradebookStudentPage'
import GradebookInstructorPage from './pages/gradebookInstructorPage'

const AuthenticatedRouter = () => (
  <Switch>
    <Route exact path='/' component={HomePage} />
    <Route exact path='/users/:userId/update' component={UserDetailPage} />
    <Route exact path='/users/:userId/submissions' component={UserSubmissionsListPage} />
    {/* Just reuse the homepage here, for now this is fine. we might want to change this in the future though which is why they exist as separate routes */}
    <Route exact path='/users/:userId/assignments' component={HomePage} />
    <Route exact path='/users/:userId/assignments/createAssignment' component={AssignmentCreatePage}/>
    <Route exact path='/users/:userId/assignments/updateAssignment/:assignmentId' component={AssignmentUpdatePage}/>
    <Route exact path='/users/:userId/courses' component={UserCoursesListPage} />
    <Route exact path='/users/:userId/courses/courseForm' component={EditCourseFormPage} />
    <Route exact path='/submissions/:submissionId' component={SubmissionDetailPage} />
    <Route exact path='/courses/' component={CoursesListPage} />
    <Route exact path='/courses/:courseId' component={CourseDetailPage} />
    <Route exact path='/courses/:courseId/update' component={CourseUpdatePage} />
    <Route exact path='/courses/:courseId/users' component={CourseUsersListPage} />
    <Route exact path='/courses/:courseId/assignments' component={CourseAssignmentsListPage} />
    <Route exact path='/courses/:courseId/assignments/:assignmentId' component={AssignmentDetailPage} />
    <Route exact path='/courses/:courseId/assignments/:assignmentId/update' component={AssignmentUpdatePage} />
    <Route exact path='/courses/:courseId/gradebook' component={GradebookStudentPage} />
    <Route exact path='/courses/:courseId/gradebook/instructor' component={GradebookInstructorPage} />
    <Route component={NotFoundPage} />
  </Switch>
)

export default AuthenticatedRouter
