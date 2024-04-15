import {NextFunction, Request, Response} from "express";
import {NotFound} from "../utils/apiResponse.utils";
import AssignmentService from '../entities/assignment/assignment.service'
import CourseService from '../entities/course/course.service'
import UserCourseService from '../entities/userCourse/userCourse.service'
import RoleService from "../entities/role/role.service";

/**
 * Are you authorized to access this endpoint?
 *
 * @param permission if the user has this permission, they are authorized
 * @param permissionIfSelf if the user does not have the first 'permission', but they have the 'permissionIfSelf' and
 * 'expectedSelfId' matches their user id, then they are authorized
 * @param expectedSelfId id that must match the user id if using a self permission
 */
export function isAuthorized(permission: string, permissionIfSelf?: string, expectedSelfId?: string) {
    return async function (req: Request, res: Response, next: NextFunction) {
        const courseId = parseInt(req.params.courseId)
        const userId = req.currentUser?.userId

        if(!courseId || !userId){
            return res.status(404).json(NotFound)
        }

        const userCourse = await UserCourseService.retrieveByCourseAndUser(courseId, userId)

        if(!userCourse){
            return res.status(404).json(NotFound)
        }

        RoleService.retrieve()
        // Pull course
        // Pull userCourse
        // Pull role

        // if anything doesn't exist, return a 404 (prevents leaking the course list since you get the same error if the course exists or not if you're not enrolled)

        // Check permission

        // 403 if no permission


        // if (!req.params[routeParameter])
        //     return res
        //         .status(400)
        //         .json(new GenericResponse(`Missing  ${routeParameter} param on ${routeParameter} required request`))
        //
        // const id = parseInt(req.params[routeParameter])
        //
        // if (isNaN(id)) return res.status(400).json(new GenericResponse(routeParameter + ' is expected to be a number'))

        next()
    }


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

    // if(!req.currentUser){
    //     return res.status(401).json(new GenericResponse('Need to be logged in for this endpoint'))
    // }
    //
    // if("course doesn't exist" || "your are not enrolled in this course"){
    //     return res.status(404).json(new GenericResponse('Course not found or you\'re enrolled in this course'))
    // }
    //
    // if("course doesn't exist"){
    //     return res.status(404).json(new GenericResponse('Course not found'))
    // }
    //
    // // check if they are enrolled in the course -or- if they are system-level admin
    // // -if they have a userCourse, pull their role
    //
    // req.path
    //
    // // if(false) {
    //     return res.status(403).json(new GenericResponse('You do not have permission to access this endpoint'))
    // // }

    // next()
}

/**
 * Checks if the user is authorized to view a specific assignment. If the assignment is released, check if they have
 * the 'assignmentViewReleased' permission. If the assignment is not released, check if they have the
 * 'assignmentViewAll' permission
 *
 * Assumes the request has the assignment id as a request param named 'assignmentId'. The id is verified to be an int,
 * but not checked to be a valid assignment id
 */
export async function isAuthorizedByAssignmentStatus(req: Request, res: Response, next: NextFunction) {
    const assignmentId = parseInt(req.params['assignmentId'])
    const isAssignmentReleased = await AssignmentService.isReleased(assignmentId)
    const permissionString = isAssignmentReleased ? 'assignmentViewReleased' : 'assignmentViewAll'
    await isAuthorized(permissionString)(req, res, next)
    // TODO: this needs to be tested
}

/**
 * Authorized if the user has the 'permission' or if they have the 'selfPermission' and their id matches the selfIdParam
 * @param permission
 * @param selfPermission
 * @param selfIdParam
 */
export async function isAuthorizedIfSelfPathParam(permission: string, selfPermission: string, selfIdParam: string) {
    return async function (req: Request, res: Response, next: NextFunction) {


        const assignmentId = parseInt(req.params['assignmentId'])
        const isAssignmentReleased = await AssignmentService.isReleased(assignmentId)
        const permissionString = isAssignmentReleased ? 'assignmentViewReleased' : 'assignmentViewAll'
        await isAuthorized(permissionString)(req, res, next)
        // TODO: this needs to be tested
    }
}


export async function isAuthorizedIfSelfBodyParam(permission: string, selfPermission: string, selfIdField: string) {
    return async function (req: Request, res: Response, next: NextFunction) {


        const assignmentId = parseInt(req.params['assignmentId'])
        const isAssignmentReleased = await AssignmentService.isReleased(assignmentId)
        const permissionString = isAssignmentReleased ? 'assignmentViewReleased' : 'assignmentViewAll'
        await isAuthorized(permissionString)(req, res, next)
        // TODO: this needs to be tested
    }
}

export async function isAuthorizedIfSelfField(permission: string, selfPermission: string, selfIdField: string) {
    return async function (req: Request, res: Response, next: NextFunction) {


        const assignmentId = parseInt(req.params['assignmentId'])
        const isAssignmentReleased = await AssignmentService.isReleased(assignmentId)
        const permissionString = isAssignmentReleased ? 'assignmentViewReleased' : 'assignmentViewAll'
        await isAuthorized(permissionString)(req, res, next)
        // TODO: this needs to be tested
    }
}

