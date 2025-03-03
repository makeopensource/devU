import React from 'react';
import { Link } from 'react-router-dom';
import FaIcon from 'components/shared/icons/faIcon';
import { useAppSelector } from 'redux/hooks';
import RequestService from 'services/request.service';
import styles from './userOptionsDropdown.scss';
import { useParams, useHistory } from 'react-router-dom'
import { SET_ALERT } from 'redux/types/active.types';
import { useActionless } from 'redux/hooks';

const UserOptionsDropdown = () => {
    const name = useAppSelector((state) => state.user.preferredName || state.user.email);
    const userId = useAppSelector((state) => state.user.id);
    const { courseId } = useParams<{courseId: string}>()
    const [setAlert] = useActionless(SET_ALERT);
    const history = useHistory();
    
    const handleLogout = async () => {
        RequestService.get(`/api/logout`, { credentials: 'include' }, true).finally(() => window.location.reload());
    };

    const handleDropCourse = () => {
      //confirmation to drop course or not
      var confirm = window.confirm("Are you sure you want to drop?");
      if (confirm)
      {
          RequestService.delete(`/api/course/${courseId}/user-courses`).then(() => {
         
              setAlert({autoDelete: true, type: 'success', message: 'Course Dropped'})
              history.push('/courses')

      }).catch((error: Error) => {
          const message = error.message
          setAlert({autoDelete: false, type: 'error', message})  })
      }
  }

    return (
        <div className={styles.dropdown} tabIndex={1}>
            <button className={styles.trigger}>
                <label className={styles.name}>{name}</label>
                <FaIcon icon='user-circle' className={styles.userIcon} />
                <FaIcon icon='caret-down' className={styles.caret} />
            </button>

            <div className={styles.menu}>
                <Link to={`/user/${userId}/update`} className={styles.option}>
                    Account
                </Link>

                <button className={styles.option} onClick={handleDropCourse}>
                   Drop Course
                </button>
                <button onClick={handleLogout} className={styles.option}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default UserOptionsDropdown;
