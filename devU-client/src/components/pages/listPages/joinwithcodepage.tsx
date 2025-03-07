import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import PageWrapper from "components/shared/layouts/pageWrapper";
import RequestService from "services/request.service";
import styles from "./joinwithcodepage.scss";
import Button from "@mui/material/Button";
import { useAppSelector } from "../../../redux/hooks";

const JoinWithCodePage = () => {
    const [accessCode, setAccessCode] = useState("");
    const [error, setError] = useState("");
    const history = useHistory();
    const userId = useAppSelector((store) => store.user.id);

    const handleJoinCourse = async () => {
        if (!accessCode.trim()) {
            setError("Please enter a valid course code.");
            return;
        }
    
        try {
            // ✅ Step 1: Find course ID using the access code
            const courseResponse = await RequestService.get(`/api/courses/by-code/${accessCode}`);
            const courseId = courseResponse.id;
    
            if (!courseId) {
                setError("Invalid course code or course not found.");
                return;
            }
    
            // ✅ Step 2: Join the course using the course ID
            await RequestService.post(`/api/course/${courseId}/user-courses`, {
                userId: userId,
                courseId: courseId,
                role: 'student',
                dropped: false
            });
    
            alert("Successfully joined the course!");
            history.push("/");
        } catch (err) {
            setError("Invalid code or course not found.");
        }
    };
    

    return (
        <PageWrapper>
            <div className={styles.joinCourseContainer}>
                <h2>Enter course access code</h2>
                <input
                    type="text"
                    placeholder="e.g. aj3auco9k"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className={styles.inputField}
                />
                {error && <p className={styles.error}>{error}</p>}
                <Button variant="contained" className={styles.joinButton} onClick={handleJoinCourse}>
                    Join
                </Button>
            </div>
        </PageWrapper>
    );
};

export default JoinWithCodePage;
