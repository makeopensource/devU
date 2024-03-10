const API_URL = 'http://localhost:3001'


// fetch token with login route automatically
async function fetchToken() {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{"email":"name@buffalo.edu","externalId":"101"}',
  }

  const rep = await fetch(API_URL + '/login/developer', options)
  // get token in set-cookie header which will be in the format refreshToken='...'
  const tmp = rep.headers.get('Set-Cookie')?.split('=')[1]

  if (tmp === undefined) {
    throw Error('Api token not found')
  }
  // remove ';Max-Age'
  apiToken = tmp.split(';')[0]
}

let apiToken = ''

//Returns the ID of the newly created entry
async function SendPOST(path: string, requestBody: string) {
  let response = await fetch(API_URL + path, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + apiToken,
      'Content-Type': 'application/json',
    },
    body: requestBody,
  })
  if (response.status == 401 || response.status == 403) {
    console.log('Status code: ' + response.status)
    const responseBody = await response.json()
    console.log(responseBody)
    throw new Error('401 or 403 HTTP Response Received, make sure you set the TOKEN constant to a valid auth token')
  } else if (response.status >= 400) {
    console.log('Status code: ' + response.status)
    const responseBody = await response.json()
    console.log(responseBody)
    throw new Error('400/500 Level HTTP Response Received: ' + response.status)
  } else {
    const responseBody = await response.json()
    return responseBody.id
  }
}

/*
    -- Billy --
    Student in 302

    -- Bob --
    Student in 312

    -- Jones --
    Student in 302 & 312
    hasn't submitted anything
*/
async function RunRequests() {
  try {
    await fetchToken()

    //Users
    const userBilly = await SendPOST('/users', JSON.stringify({
      email: 'billy@buffalo.edu', externalId: 'billy', preferredName: 'Billiam',
    }))
    const userBob = await SendPOST('/users', JSON.stringify({
      email: 'bob@buffalo.edu', externalId: 'bob', preferredName: 'Bobby',
    }))
    const userJones = await SendPOST('/users', JSON.stringify({
      email: 'jones@buffalo.edu', externalId: 'jones', preferredName: 'Jones',
    }))


    //Courses
    const course312 = await SendPOST('/courses', JSON.stringify({
      name: 'Web Applications',
      semester: 's2024',
      number: 'CSE312',
      startDate: '2024-01-24T00:00:00-0500',
      endDate: '2024-05-10T23:59:59-0500',
    }))
    const course302 = await SendPOST('/courses', JSON.stringify({
      name: 'Intro to Experiential Learning',
      semester: 's2024',
      number: 'CSE302',
      startDate: '2024-01-24T00:00:00-0500',
      endDate: '2024-05-07T23:59:59-0500',
    }))


    //UserCourse
    SendPOST('/user-courses', JSON.stringify({
      userId: userBilly, courseId: course302, level: 'student', dropped: false,
    }))
    SendPOST('/user-courses', JSON.stringify({
      userId: userBob, courseId: course312, level: 'student', dropped: false,
    }))
    SendPOST('/user-courses', JSON.stringify({
      userId: userJones, courseId: course302, level: 'student', dropped: false,
    }))
    SendPOST('/user-courses', JSON.stringify({
      userId: userJones, courseId: course312, level: 'student', dropped: false,
    }))

    //Categories
    SendPOST('/categories', JSON.stringify({
      courseId: course312, name: 'Homework'
    }))
    SendPOST('/categories', JSON.stringify({
      courseId: course312, name: 'Quizzes'
    }))
    SendPOST('/categories', JSON.stringify({
      courseId: course302, name: 'Sprints'
    }))

    //Assignments
    const assign312_1 = await SendPOST('/assignments', JSON.stringify({
      courseId: course312,
      name: 'Homework 1',
      startDate: '2024-02-05T00:00:00-0500',
      dueDate: '2024-02-26T23:59:59-0500',
      endDate: '2024-03-11T23:59:59-0500',
      gradingType: 'code',
      categoryName: 'Homework',
      description: 'HTTP',
      maxFileSize: 10000000,
      maxSubmissions: 10,
      disableHandins: false,
    }))
    const assign312_2 = await SendPOST('/assignments', JSON.stringify({
      courseId: course312,
      name: 'Homework 2',
      startDate: '2024-02-19T00:00:00-0500',
      dueDate: '2024-03-11T23:59:59-0500',
      endDate: '2024-04-01T23:59:59-0500',
      gradingType: 'code',
      categoryName: 'Homework',
      description: 'Authentication',
      maxFileSize: 10000000,
      maxSubmissions: 10,
      disableHandins: false,
    }))
    SendPOST('/assignments', JSON.stringify({
      courseId: course312,
      name: 'Homework 3',
      startDate: '2024-03-04T00:00:00-0500',
      dueDate: '2024-04-01T23:59:59-0500',
      endDate: '2024-04-15T23:59:59-0500',
      gradingType: 'code',
      categoryName: 'Homework',
      description: 'Image Uploads',
      maxFileSize: 10000000,
      maxSubmissions: 10,
      disableHandins: false,
    }))
    const assign312_quiz = await SendPOST('/assignments', JSON.stringify({
      courseId: course312,
      name: '2/19 Quiz',
      startDate: '2024-02-09T16:00:00-0500',
      dueDate: '2024-02-09T17:00:00-0500',
      endDate: '2024-02-09T17:00:00-0500',
      gradingType: 'non-code',
      categoryName: 'Quizzes',
      description: 'Pop quiz!',
      maxFileSize: 10000000,
      maxSubmissions: 1,
      disableHandins: false,
    }))
    const assign302_1 = await SendPOST('/assignments', JSON.stringify({
      courseId: course302,
      name: 'Sprint 1',
      startDate: '2024-01-26T00:00:00-0500',
      dueDate: '2024-02-17T23:59:59-0500',
      endDate: '2024-02-17T23:59:59-0500',
      gradingType: 'manual',
      categoryName: 'Sprints',
      description: 'The First Sprint',
      maxFileSize: 10000000,
      disableHandins: false,
    }))
    const assign302_2 = await SendPOST('/assignments', JSON.stringify({
      courseId: course302,
      name: 'Sprint 2',
      startDate: '2024-02-17T00:00:00-0500',
      dueDate: '2024-03-09T23:59:59-0500',
      endDate: '2024-03-09T23:59:59-0500',
      gradingType: 'manual',
      categoryName: 'Sprints',
      description: 'The Second Sprint',
      maxFileSize: 10000000,
      disableHandins: false,
    }))
    SendPOST('/assignments', JSON.stringify({
      courseId: course302,
      name: 'Sprint 3',
      startDate: '2024-04-06T00:00:00-0500',
      dueDate: '2024-04-06T23:59:59-0500',
      endDate: '2024-04-06T23:59:59-0500',
      gradingType: 'manual',
      categoryName: 'Sprints',
      description: 'The Third Sprint',
      maxFileSize: 10000000,
      disableHandins: false,
    }))


    //AssignmentProblems

    SendPOST("/assignment-problems", JSON.stringify({
      assignmentId: assign312_quiz, problemName: "Of the following letters A-D, which is B?", maxScore: 5
    }))
    SendPOST("/assignment-problems", JSON.stringify({
      assignmentId: assign312_quiz, problemName: "Of the following letters A-D, which is C?", maxScore: 5
    }))

    // @ts-ignore
    const assign312_quiz_q1 = await SendPOST('/assignment-problems', JSON.stringify({
      assignmentId: assign312_quiz, problemName: 'q1', maxScore: 5,
    }))
    // @ts-ignore
    const assign312_quiz_q2 = await SendPOST('/assignment-problems', JSON.stringify({
      assignmentId: assign312_quiz, problemName: 'q2', maxScore: 5,
    }))


    //Submissions
    const submission_billy_302_1 = await SendPOST('/submissions', JSON.stringify({
      courseId: course302,
      assignmentId: assign302_1,
      userId: userBilly,
      content: 'I finished all my tasks for sprint 1!',
      type: 'text',
      submitterIp: '127.0.0.1',
      submittedBy: userBilly,
    }))
    SendPOST('/submissions', JSON.stringify({
      courseId: course302,
      assignmentId: assign302_2,
      userId: userBilly,
      content: 'I finished all my tasks for sprint 2!',
      type: 'text',
      submitterIp: '127.0.0.1',
      submittedBy: userBilly,
    }))
    const submission_bob_312_1 = await SendPOST('/submissions', JSON.stringify({
      courseId: course312,
      assignmentId: assign312_1,
      userId: userBob,
      content: 'jesse pleaseee can i have a good grade pleaseeee',
      type: 'text',
      submitterIp: '127.0.0.1',
      submittedBy: userBob,
    }))
    SendPOST('/submissions', JSON.stringify({
      courseId: course312,
      assignmentId: assign312_2,
      userId: userBob,
      content: 'im begging you jesse please show mercy',
      type: 'text',
      submitterIp: '127.0.0.1',
      submittedBy: userBob,
    }))
    const submission_bob_312_quiz1 = await SendPOST('/submissions', JSON.stringify({
      courseId: course312,
      assignmentId: assign312_quiz,
      userId: userBob,
      content: '{"form":{"Of the following letters A-D, which is B?":"B","Of the following letters A-D, which is C?":"D"},"filepaths":""}',
      type: 'json',
      submitterIp: '127.0.0.1',
      submittedBy: userBob,
    }))



    //SubmissionScores
    SendPOST('/submission-scores', JSON.stringify({
      submissionId: submission_billy_302_1,
      score: 90,
      feedback: 'Good work, but please make sure you come to each team meeting fully prepared.',
      releasedAt: '2024-02-27T07:17:27-0500',
    }))
    SendPOST('/submission-scores', JSON.stringify({
      submissionId: submission_bob_312_1, score: 20, feedback: 'no', releasedAt: '2024-03-02T18:34:57-0500',
    }))
    SendPOST('/submission-scores', JSON.stringify({
      submissionId: submission_bob_312_1,
      score: 5,
      feedback: '1/2 Questions Correct',
      releasedAt: '2024-02-09T17:00:00-0500',
    }))

    // non container auto grader
    SendPOST('/nonContainerAutoGrader', JSON.stringify({
      'assignmentId': 1,
      'question': 'What do you call fake spaghetti?',
      'score': 1,
      'correctString': '/^An impasta\\.$/',
      'isRegex': true,
    }))
    SendPOST('/nonContainerAutoGrader', JSON.stringify({
      assignmentId: 1,
      question: 'why did the chicken cross the road',
      score: 100,
      correctString: 'because he wanted to get to the other side',
      isRegex: false,
    }))
    SendPOST('/nonContainerAutoGrader', JSON.stringify({
      assignmentId: 1,
      question: 'Why couldn\'t the bicycle stand up by itself?',
      score: 1,
      correctString: '/^It was (two|2)-tired\\.$/',
      isRegex: true,
    }))
    SendPOST("/nonContainerAutoGrader", JSON.stringify({
      assignmentId: assign312_quiz, 
      question: "Of the following letters A-D, which is B?", 
      score: 5, 
      correctString: "B",
      isRegex: false
  }))
    SendPOST("/nonContainerAutoGrader", JSON.stringify({
      assignmentId: assign312_quiz,
      question: "Of the following letters A-D, which is C?",
      score: 5,
      correctString: "C",
      isRegex: false,
  }))

    //Grading (creates a SubmissionScore and SubmissionProblemScores)
    SendPOST("/grade/" + submission_bob_312_quiz1, JSON.stringify({}))

    SendPOST('/deadline-extensions',JSON.stringify({
      assignmentId:1,
      creatorId:1,
      deadlineDate:"2024-05-23T03:32:32.813Z",
      userId:2
    }))

    //AssignmentScore - ROUTE NOT FUNCTIONAL
    // SendPOST("/assignment-score", JSON.stringify({
    //     assignmentId: assign302_1, userId: userBilly, score: 90
    // }))
    // SendPOST("/assignment-score", JSON.stringify({
    //     assignmentId: assign312_1, userId: userBob, score: 20
    // }))




    //CategoryScores - ROUTE NOT FUNCTIONAL


    //CourseScores - ROUTE NOT FUNCTIONAL

    console.log('Script completed successfully!')
  } catch (e) {
    console.error(e)
  }

}

RunRequests()