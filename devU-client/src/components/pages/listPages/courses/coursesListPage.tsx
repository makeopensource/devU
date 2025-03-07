import React, { useEffect, useState } from 'react';
import { Course } from 'devu-shared-modules';
import LoadingOverlay from 'components/shared/loaders/loadingOverlay';
import PageWrapper from 'components/shared/layouts/pageWrapper';
import ErrorPage from '../../errorPage/errorPage';
import RequestService from 'services/request.service';
import styles from './coursesListPage.scss';
import { useAppSelector, useActionless } from "../../../../redux/hooks";
import { SET_ALERT } from "../../../../redux/types/active.types";
import Button from '@mui/material/Button';
import { useHistory } from "react-router-dom";

const UserCoursesListPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [joinedCourses, setJoinedCourses] = useState<Set<number>>(new Set());
    const history = useHistory();

    const userId = useAppSelector((store) => store.user.id);
    const [setAlert] = useActionless(SET_ALERT); // ✅ Fix: Correct way to set alerts

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const userCourseData = await RequestService.get<{ 
                instructorCourses: Course[]; 
                activeCourses: Course[]; 
                pastCourses: Course[]; 
                upcomingCourses: Course[]; 
            }>(`/api/courses/user/${userId}`);

            const userCoursesList = [
                ...userCourseData.instructorCourses,
                ...userCourseData.activeCourses,
                ...userCourseData.pastCourses,
                ...userCourseData.upcomingCourses,
            ];

            const allCourseData = await RequestService.get<Course[]>(`/api/courses`);

            setAllCourses(allCourseData);

            
            setJoinedCourses(new Set(userCoursesList.map(course => course.id ?? -1)));
        } catch (error: unknown) {
            setError(error as Error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinCourse = async (courseId: number) => {
        const userCourseData = {
            userId: userId,
            courseId: courseId,
            role: 'student',
            dropped: false
        };

        try {
            await RequestService.post(`/api/course/${courseId}/user-courses`, userCourseData);

            
            setJoinedCourses((prev) => new Set(prev).add(courseId));

            setAlert({ autoDelete: true, type: 'success', message: 'Course Joined' });
        } catch (error: unknown) {
            setAlert({ autoDelete: false, type: 'error', message: (error as Error).message });
        }
    };

    const filteredCourses = allCourses.filter((course) =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.number.toLowerCase().includes(searchQuery.toLowerCase()) 
    );

    if (loading) return <LoadingOverlay delay={250} />;
    if (error) return <ErrorPage error={error} />;

    return (
        <PageWrapper>
            <div className={styles.coursesListPage}>
                <h1 className={styles.pageTitle}>Join Course</h1>
                <div className={styles.searchSection}>
                    <input
                        type="text"
                        placeholder="Search for courses by name or code"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className={styles.searchButton}>Search</button>
                    <button className={styles.joinWithCodeButton} onClick={() => history.push("/join-course")}>
                        Join with Code
                        </button>

                </div>

                <div className={styles.tableContainer}>
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Course Code</th>
                                {/* <th>Instructor</th> */}
                                <th>Semester</th>
                                {/* <th>Seats Open</th> */}
                                <th>Join</th> 
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCourses.length > 0 ? (
                                filteredCourses.map((course) => (
                                    <tr key={course.id}>
                                        <td>{course.name}</td> 
                                        <td>{course.number}</td> 
                                        {/* <td>{course.instructor}</td> */}
                                        <td>{course.semester}</td> 
                                        <td>
                                            <Button 
                                                variant="contained"
                                                className={styles.joinButton}
                                                onClick={() => course.id !== undefined && handleJoinCourse(course.id)}
                                                disabled={joinedCourses.has(course.id ?? -1)} // ✅ Fix: Prevents undefined issues
                                            >
                                                {joinedCourses.has(course.id ?? -1) ? "Joined" : "Join Course"}
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className={styles.noResults}>No courses found.</td> 
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageWrapper>
    );
};

export default UserCoursesListPage;
