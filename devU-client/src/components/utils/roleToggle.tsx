import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import { updateUserRole } from '../../redux/role.redux'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import React from 'react'

const RoleToggle = () => {
  const dispatch = useDispatch();
  const userRole = useSelector((state: RootState) => state.roleMode.userRole);

  const handleToggle = () => {
    const newRole = userRole === 'Student' ? 'Instructor' : 'Student';
    dispatch(updateUserRole(newRole));
  };

  return (
    <FormControlLabel label={userRole} control={
      <Switch defaultChecked
              checked={userRole === 'Instructor'}
              onChange={handleToggle}
              inputProps={{ 'aria-label': 'Toggle switch' }}
      />}
    />
  )
}

export default RoleToggle
