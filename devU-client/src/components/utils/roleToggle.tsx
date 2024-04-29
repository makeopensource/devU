import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import {updateUserRole} from '../../redux/role.redux'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from '../../redux/store'
import React, {useEffect} from 'react'
import {useParams} from "react-router-dom";
import RequestService from 'services/request.service'
import {UserCourse} from "devu-shared-modules";

const RoleToggle = () => {
  const dispatch = useDispatch();
  const userRole = useSelector((state: RootState) => state.roleMode.userRole);
  const [hasCoursePath, setHasCoursePath] = React.useState(false)
  const {courseId} = useParams<{ courseId: string }>()

  useEffect(() => {
    const path = window.location.pathname
    const hasCoursePath = path.includes('/course/')
    setHasCoursePath(hasCoursePath)

    if (hasCoursePath) {
      RequestService.get(`/api/course/${courseId}/user-courses/users`)
      .then((response) => {
        const userCourses: UserCourse = response;
        if (userCourses.role === 'instructor') {
          handleToggle()
          dispatch(updateUserRole('Instructor'));
        } else {
          handleToggle()
          dispatch(updateUserRole('Student'));
        }
      })
      .catch(error => {
        console.error(error)
      })
    }

  }, [courseId, dispatch]);

  const handleToggle = () => {
    const newRole = userRole === 'Student' ? 'Instructor' : 'Student';
    dispatch(updateUserRole(newRole));
  };


  return (
    <FormControlLabel label={userRole} control={
      <Switch defaultChecked
              disabled={hasCoursePath}
              checked={userRole === 'Instructor'}
              onChange={handleToggle}
              inputProps={{ 'aria-label': 'Toggle switch' }}
      />}
    />
  )
}

export default RoleToggle
