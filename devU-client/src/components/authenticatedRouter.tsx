import React from 'react'
import {Route, Switch} from 'react-router-dom'

import AssignmentDetailPage from 'components/pages/assignmentDetailPage'
import AssignmentCreatePage from 'components/pages/assignmentFormPage'
import AssignmentUpdatePage from 'components/pages/assignmentUpdatePage'
import CourseAssignmentsListPage from 'components/pages/courseAssignmentsListPage'
import CourseDetailPage from 'components/pages/courseDetailPage'
import EditCourseFormPage from 'components/pages/coursesFormPage'
import CourseUpdatePage from 'components/pages/courseUpdatePage'
import HomePage from 'components/pages/homePage'
import NotFoundPage from 'components/pages/notFoundPage'
import SubmissionDetailPage from 'components/pages/submissionDetailPage'
import UserDetailPage from 'components/pages/userDetailPage'
import NonContainerAutoGraderForm from './pages/nonContainerAutoGraderForm'
import GradebookStudentPage from './pages/gradebookStudentPage'
import GradebookInstructorPage from './pages/gradebookInstructorPage'
import SubmissionFeedbackPage from './pages/submissionFeedbackPage'
import ContainerAutoGraderForm from './pages/containerAutoGraderForm'
import CoursePreviewPage from './pages/coursePreviewPage'
import CoursesListPage from "./pages/coursesListPage";

const AuthenticatedRouter = () => (
    <Switch>

        <Route exact path='/' component={HomePage}/>
        <Route exact path='/courses' component={CoursesListPage}/>
        <Route exact path='/addCoursesForm' component={EditCourseFormPage}/>

        <Route exact path='/user/:userId/update' component={UserDetailPage}/>

        <Route exact path='/course/:courseId' component={CourseDetailPage}/>
        <Route exact path='/course/:courseId/preview' component={CoursePreviewPage}/>
        <Route exact path='/course/:courseId/update' component={CourseUpdatePage}/>
        <Route exact path='/course/:courseId/gradebook' component={GradebookStudentPage}/>
        <Route exact path='/course/:courseId/createAssignment' component={AssignmentCreatePage}/>
        <Route exact path='/course/:courseId/assignments' component={CourseAssignmentsListPage}/>
        <Route exact path='/course/:courseId/gradebook/instructor' component={GradebookInstructorPage}/>

        <Route exact path='/course/:courseId/assignment/:assignmentId' component={AssignmentDetailPage}/>
        <Route exact path='/course/:courseId/assignment/:assignmentId/update' component={AssignmentUpdatePage}/>
        <Route exact path='/course/:courseId/assignment/:assignmentId/createNCAG'
               component={NonContainerAutoGraderForm}/>
        <Route exact path='/course/:courseId/assignment/:assignmentId/createCAG' component={ContainerAutoGraderForm}/>

        <Route exact path='/course/:courseId/assignment/:assignmentId/submission/:submissionId'
               component={SubmissionDetailPage}/>
        <Route exact path='/course/:courseId/assignment/:assignmentId/submission/:submissionId/feedback'
               component={SubmissionFeedbackPage}/>

        <Route component={NotFoundPage}/>
    </Switch>
)

export default AuthenticatedRouter
