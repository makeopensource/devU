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
import UserSubmissionsListPage from 'components/pages/userSubmissionsListPage'
import NonContainerAutoGraderForm from './pages/nonContainerAutoGraderForm'
import GradebookStudentPage from './pages/gradebookStudentPage'
import GradebookInstructorPage from './pages/gradebookInstructorPage'
import SubmissionFeedbackPage from './pages/submissionFeedbackPage'
import ContainerAutoGraderForm from './pages/containerAutoGraderForm'
import CoursePreviewPage from './pages/coursePreviewPage'
import CoursesListPage from "./pages/coursesListPage";
import userCoursesListPage from "./pages/userCoursesListPage";

const AuthenticatedRouter = () => (
    <Switch>
        <Route exact path='/' component={HomePage}/>
        <Route exact path='/users/:userId/update' component={UserDetailPage}/>
        <Route exact path='/submissions' component={UserSubmissionsListPage}/>
        {/* Just reuse the homepage here, for now this is fine. we might want to change this in the future though which is why they exist as separate routes */}
        {/*<Route exact path='/assignments' component={HomePage}/>*/}
        <Route exact path='/myCourses' component={userCoursesListPage}/>
        <Route exact path='/addCoursesForm' component={EditCourseFormPage}/>
        <Route exact path='/courses/:courseId/assignments/:assignmentId/submissions/:submissionId'
               component={SubmissionDetailPage}/>
        <Route exact path='/courses/:courseId/assignments/:assignmentId/submissions/:submissionId/feedback'
               component={SubmissionFeedbackPage}/>
        <Route exact path='/courses/' component={CoursesListPage}/>
        <Route exact path='/courses/:courseId' component={CourseDetailPage}/>
        <Route exact path='/courses/:courseId/update' component={CourseUpdatePage}/>
        {/*<Route exact path='/courses/:courseId/users' component={CoursesListPage} />*/}
        <Route exact path='/courses/:courseId/assignments' component={CourseAssignmentsListPage}/>
        <Route exact path='/courses/:courseId/assignments/create' component={AssignmentCreatePage}/>
        <Route exact path='/courses/:courseId/assignments/:assignmentId' component={AssignmentDetailPage}/>
        <Route exact path='/courses/:courseId/assignments/:assignmentId/update' component={AssignmentUpdatePage}/>
        <Route exact path='/courses/:courseId/assignments/:assignmentId/createNCAG'
               component={NonContainerAutoGraderForm}/>
        <Route exact path='/courses/:courseId/assignments/:assignmentId/createCAG' component={ContainerAutoGraderForm}/>
        <Route exact path='/courses/:courseId/gradebook' component={GradebookStudentPage}/>
        <Route exact path='/courses/:courseId/gradebook/instructor' component={GradebookInstructorPage}/>
        <Route exact path='/courses/:courseId/preview' component={CoursePreviewPage}/>
        <Route component={NotFoundPage}/>
    </Switch>
)

export default AuthenticatedRouter
