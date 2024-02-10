const API_URL = "http://localhost:3001"

//Set to a valid refreshToken
const TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNrMDcxMTIwMjEifQ.eyJ1c2VySWQiOjMsImlzUmVmcmVzaFRva2VuIjp0cnVlLCJpYXQiOjE3MDczNjI3MDEsImV4cCI6MTcwODIyNjcwMSwiYXVkIjpbImRldlUtYXBpIiwiZGV2VS1jbGllbnQiXSwiaXNzIjoiZGV2VS1hdXRoIiwic3ViIjoiMyJ9.keUclDZXPaqn9-AWV3Vx1BmhN4IgC21VUfSe64xSAOxpYBejYI3OW9_0mC_2LPUz122WRKzLPq7F87z58GLL5BZ11kHCbBL1gAToVlfNig1sQFHUh3HP0NPe5If0xIZEpeG-fJsgbCfBjxTRnLOgsQgDBTrCz5fZHWPRLk0VT_NVtZc6ReCpatX6H4eeLxybY5GSJcPu-GyHETbNnwtt5TRMFsaaEXzPsACzI3LGSurXKNmiAnnG7nm04s1Y3aVIk67YLL1DxmvZFj-u5t9Il7HCFCLTNAyMZIicDBwaa0K5FjG3DF_ufM8Zrvq-uM8y1j-eY1RCyrYW1wGfLjdhmsKh2F5mhuBxk7DLmdS4GCXPekphFtH1Y0uN6CQM4_8tvbNX0v3BzG3FEeLoF4j5WmZa8DmT-QXs4PxtloCCNw9NFbXqATN684FnG5U7BiZVij4mG81Rfn990GDzmEd4BEOMn8mwXeG1-k0YCMU0I5lXkSlRO-M_n030M1dNyPnb"

//Returns the ID of the newly created entry
async function SendPOST(path: string, requestBody: string) {
    let response = await fetch(API_URL + path, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + TOKEN,
            "Content-Type": "application/json"
        },
        body: requestBody
    })
    if (response.status >= 400) {
        console.log(response.status)
        throw new Error("400/500 Level HTTP Response Recieved")
    } else {
        const responseBody = await response.json()
        return responseBody.id
    }
}

/*
    -- Billy --
    Student in 302
    has submitted two assignments, one is graded

    -- Bob --
    Student in 312
    has submitted two assignments, one is graded

    -- Jones --
    Student in 302 & 312
    hasn't submitted anything
*/
async function RunRequests() {
    try {
        //Users
        const userBilly = await SendPOST("/users", JSON.stringify({
            email: "billy@buffalo.edu", externalId: "billy", preferredName: "Billiam"
        }))
        const userBob = await SendPOST("/users", JSON.stringify({
            email: "bob@buffalo.edu", externalId: "bob", preferredName: "Bobby"
        }))
        const userJones = await SendPOST("/users", JSON.stringify({
            email: "jones@buffalo.edu", externalId: "jones", preferredName: "Jones"
        }))


        //Courses
        const course312 = await SendPOST("/courses", JSON.stringify({
            name: "Web Applications", semester: "s2024", number: "CSE312", startDate: "2024-01-24", endDate: "2024-05-10"
        }))
        const course302 = await SendPOST("/courses", JSON.stringify({
            name: "Intro to Experiential Learning", semester: "s2024", number: "CSE302", startDate: "2024-01-24", endDate: "2024-05-07"
        }))


        //UserCourse
        SendPOST("/user-courses", JSON.stringify({
            userId: userBilly, courseId: course302, level: "student", dropped: false
        }))
        SendPOST("/user-courses", JSON.stringify({
            userId: userBob, courseId: course312, level: "student", dropped: false
        }))
        SendPOST("/user-courses", JSON.stringify({
            userId: userJones, courseId: course302, level: "student", dropped: false
        }))
        SendPOST("/user-courses", JSON.stringify({
            userId: userJones, courseId: course312, level: "student", dropped: false
        }))
        

        //Assignments
        const assign312_1 = await SendPOST("/assignments", JSON.stringify({
            courseId: course312, name: "Homework 1", startDate: "2024-02-05", dueDate: "2024-02-26", endDate: "2024-03-11", gradingType: "code", categoryName: "Homework",
            description: "HTTP", maxFileSize: 10000000, maxSubmissions: 10, disableHandins: false
        }))
        const assign312_2 = await SendPOST("/assignments", JSON.stringify({
            courseId: course312, name: "Homework 2", startDate: "2024-02-19", dueDate: "2024-03-11", endDate: "2024-04-01", gradingType: "code", categoryName: "Homework",
            description: "Authentication", maxFileSize: 10000000, maxSubmissions: 10, disableHandins: false
        }))
        SendPOST("/assignments", JSON.stringify({
            courseId: course312, name: "Homework 3", startDate: "2024-03-04", dueDate: "2024-04-01", endDate: "2024-04-15", gradingType: "code", categoryName: "Homework",
            description: "Image Uploads", maxFileSize: 10000000, maxSubmissions: 10, disableHandins: false
        }))
        // const assign312_quiz = await SendPOST("/assignments", JSON.stringify({
        //     courseId: course312, name: "2/19 Quiz", startDate: "2024-02-09T16:00:00-0500", dueDate: "2024-02-09T17:00:00-0500", endDate: "2024-02-09T17:00:01-0500", 
        //     gradingType: "non-code", categoryName: "Quizzes", description: "Pop quiz!", maxFileSize: 10000000, maxSubmissions: 1, disableHandins: false
        // }))
        const assign302_1 = await SendPOST("/assignments", JSON.stringify({
            courseId: course302, name: "Sprint 1", startDate: "2024-01-26", dueDate: "2024-02-17", endDate: "2024-02-17T00:00:01-0500", gradingType: "manual", categoryName: "Sprints",
            description: "The First Sprint", maxFileSize: 10000000, disableHandins: false
        }))
        const assign302_2 = await SendPOST("/assignments", JSON.stringify({
            courseId: course302, name: "Sprint 2", startDate: "2024-02-17", dueDate: "2024-03-09", endDate: "2024-03-09T00:00:01-0500", gradingType: "manual", categoryName: "Sprints",
            description: "The Second Sprint", maxFileSize: 10000000, disableHandins: false
        }))
        SendPOST("/assignments", JSON.stringify({
            courseId: course302, name: "Sprint 3", startDate: "2024-03-09", dueDate: "2024-04-06", endDate: "2024-04-06T00:00:01-0500", gradingType: "manual", categoryName: "Sprints",
            description: "The Third Sprint", maxFileSize: 10000000, disableHandins: false
        }))


        //AssignmentProblems - ROUTE NOT IMPLEMENTED
        // const assign312_quiz_q1 = await SendPOST("/assignment-problems", JSON.stringify({
        //     assignmentId: assign312_quiz, problemName: "q1", maxScore: 5
        // }))
        // const assign312_quiz_q2 = await SendPOST("/assignment-problems", JSON.stringify({
        //     assignmentId: assign312_quiz, problemName: "q2", maxScore: 5
        // }))


        //Submissions
        const submission_billy_302_1 = await SendPOST("/submissions", JSON.stringify({
            courseId: course302, assignmentId: assign302_1, userId: userBilly, content: "I finished all my tasks for sprint 1!", type: "text", 
            submitterIp: "127.0.0.1", submittedBy: userBilly
        }))
        SendPOST("/submissions", JSON.stringify({
            courseId: course302, assignmentId: assign302_2, userId: userBilly, content: "I finished all my tasks for sprint 2!", 
            type: "text", submitterIp: "127.0.0.1", submittedBy: userBilly
        }))
        const submission_bob_312_1 = await SendPOST("/submissions", JSON.stringify({
            courseId: course312, assignmentId: assign312_1, userId: userBob, content: "jesse pleaseee can i have a good grade pleaseeee", type: "text",
            submitterIp: "127.0.0.1", submittedBy: userBob
        }))
        SendPOST("/submissions", JSON.stringify({
            courseId: course312, assignmentId: assign312_2, userId: userBob, content: "im begging you jesse give this one a good grade", type: "text",
            submitterIp: "127.0.0.1", submittedBy: userBob
        }))
        // const submission_bob_312_quiz1 = await SendPOST("/submissions", JSON.stringify({
        //     courseId: course312, assignmentId: assign312_quiz, userId: userBob, content: "B", type: "text", submitterIp: "127.0.0.1", submittedBy: userBob
        // }))
        
        
        //SubmissionProblemScores - ROUTE NOT IMPLEMENTED
        // SendPOST("/submission-problem-scores", JSON.stringify({
        //     submissionId: submission_bob_312_quiz1, assignmentProblemId: assign312_quiz_q1, score: 5, feedback: "Good job!"
        // }))


        //SubmissionScores - Swagger documentation is wrong, /submission-scores not /submission-score
        SendPOST("/submission-scores", JSON.stringify({
            submissionId: submission_billy_302_1, score: 90, feedback: "Good work, but make sure you come to each team meeting fully prepared.", releasedAt: "2024-02-27"
        }))
        SendPOST("/submission-scores", JSON.stringify({
            submissionId: submission_bob_312_1, score: 20, feedback: "no", releasedAt: "2024-03-02"
        }))


        //AssignmentScore - ROUTE NOT IMPLEMENTED
        // SendPOST("/assignment-score", JSON.stringify({
        //     assignmentId: assign302_1, userId: userBilly, score: 90
        // }))
        // SendPOST("/assignment-score", JSON.stringify({
        //     assignmentId: assign312_1, userId: userBob, score: 20
        // }))


        //Categories - ROUTE NOT IMPLEMENTED


        //CourseScores - ROUTE NOT IMPLEMENTED

        console.log("Script completed successfully!")
    } catch (e) {
        console.error(e)
    }
    
}

RunRequests()

