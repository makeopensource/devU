import {NextFunction, Request, Response} from "express";
import {GenericResponse} from "../utils/apiResponse.utils";




export async function isAuthorized(req: Request, res: Response, next: NextFunction){

    // Option 1: Add user id to every path where users could be able to access only their content <-- painful for
    // certain paths (/course/2/assignments/45/user/12) need to validate later that the id in the url matches the data..
    // not to mention the duplicate data

    // Option 2: pull the data and check a field to see if they can access <--  seems more likely to produce bugs

    // return the middleware based on:
    // -what perm in the role do they need?
    // -is there a field that is cool as long as it matches this user's id?

    // role permissions include:
    // -grade anything (put/post)
    // -delete grades?
    // -create submissions on behalf of students
    // -create assignments +categories
    // -create graders
    // -upload container autograders
    // -is delete separate? or can they delete if they can edit?
    // -view unreleased assignments
    // -manage extensions
    // -add userCourse
    // --should be instructor only since you could add more instructors.. otherwise, need a check to see if they are adding a userCourse at an allowed role
    // --Or have separate paths for add-student and add-user
    // -add a role
    // -muck around with rosters
    // -Download the grading code
    // -view all submissions (Without being able to grade them)
    // -access based on sections?..

    // Two default roles
    // -student - can only access what everyone can access

    // Add extra endpoint for authorization
    // -GET /released-assignments (available to all)
    // -GET /assignments (with authorization check)

    // everyone can (default role/students role)
    // -GET released assignments
    // -GET submissions and scores that match their id
    // -POST assignments on their own behalf

    // need a filter after the fact too. pre-check to see if they can access the endpoint at all. post-filter to filter down to the data they are allowed to access
    // -or is this just part of each endpoint? eg. GET /courses only returns the courses that user is enrolled (Or every course if you're system-admin)

    if(!req.currentUser){
        return res.status(401).json(new GenericResponse('Need to be logged in for this endpoint'))
    }

    // check if they are enrolled in the course -or- if they are system-level admin
    // -if they have a userCourse, pull their role

    req.path

    // if(false) {
        return res.status(403).json(new GenericResponse('You do not have permission to access this endpoint'))
    // }

    // next()
}