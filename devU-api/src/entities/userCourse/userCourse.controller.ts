import {Request, Response, NextFunction} from 'express'

import UserCourseService from './userCourse.service'
import {serialize} from './userCourse.serializer'

import {GenericResponse, NotFound, Updated} from '../../utils/apiResponse.utils'

export async function getAll(req: Request, res: Response, next: NextFunction) {
    try {

        const userCourses = await UserCourseService.listAll()

        res.status(200).json(userCourses.map(serialize))
    } catch (err) {
        next(err)
    }
}

export async function get(req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id)
        const userCourses = await UserCourseService.list(id)

        res.status(200).json(userCourses.map(serialize))
    } catch (err) {
        next(err)
    }
}

export async function getByCourse(req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id)
        const userCourses = await UserCourseService.listByCourse(id)

        const response = userCourses.map(serialize)

        res.status(200).json(response)
    } catch (err) {
        next(err)
    }
}

export async function detail(req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id)
        const userCourse = await UserCourseService.retrieve(id)

        if (!userCourse) return res.status(404).json(NotFound)

        const response = serialize(userCourse)

        res.status(200).json(response)
    } catch (err) {
        next(err)
    }
}

export async function detailByUser(req: Request, res: Response, next: NextFunction) {
    try {
        const courseId = parseInt(req.params.courseId)
        const userId = parseInt(req.params.userId)
        const userCourse = await UserCourseService.retrieveByCourseAndUser(courseId, userId)

        if (!userCourse) return res.status(404).json(NotFound)

        const response = serialize(userCourse)

        res.status(200).json(response)
    } catch (err) {
        next(err)
    }
}

export async function post(req: Request, res: Response, next: NextFunction) {
    try {
        const userCourse = await UserCourseService.create(req.body)
        const response = serialize(userCourse)

        res.status(201).json(response)
    } catch (err) {
        res.status(400).json(new GenericResponse(err.message))
    }
}

export async function put(req: Request, res: Response, next: NextFunction) {
    try {
        req.body.id = parseInt(req.params.id)
        const results = await UserCourseService.update(req.body)

        if (!results.affected) return res.status(404).json(NotFound)

        res.status(200).json(Updated)
    } catch (err) {
        next(err)
    }
}

export async function _delete(req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id)
        const results = await UserCourseService._delete(id)

        if (!results.affected) return res.status(404).json(NotFound)

        res.status(204).send()
    } catch (err) {
        next(err)
    }
}

export default {get, getByCourse, getAll, detail, detailByUser, post, put, _delete}
