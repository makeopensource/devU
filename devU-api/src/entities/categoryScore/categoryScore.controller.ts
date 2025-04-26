import { NextFunction, Request, Response } from 'express'

import CategoryScoreService from './categoryScore.service'

import { NotFound, Updated } from '../../utils/apiResponse.utils'
import { serialize } from './categoryScore.serializer'
import { CategoryScorePatch, CategoryScorePost } from 'devu-shared-modules'

export async function listByCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const courseId = parseInt(req.params.courseId, 10)
    if (isNaN(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID format' })
    }

    const categoryScores = await CategoryScoreService.listByCourse(courseId)
    const response = categoryScores.map(serialize)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function detailById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10)
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid category score ID format' })
    }

    const categoryScore = await CategoryScoreService.retrieve(id)

    if (!categoryScore) {
      // Use the imported NotFound response utility
      return res.status(404).json(NotFound)
    }

    // Serialize the single entity
    const response = serialize(categoryScore)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

export async function detailByName(req: Request, res: Response, next: NextFunction) {
  try {
    // Category name is likely a string, no need to parse as int
    const categoryName = req.params.categoryName
    if (!categoryName) {
      return res.status(400).json({ message: 'Category name parameter is required' })
    }

    // Use the retrieveByName method from the service
    const categoryScore = await CategoryScoreService.retrieveByName(categoryName)

    if (!categoryScore) {
      return res.status(404).json(NotFound)
    }

    const response = serialize(categoryScore)

    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}


export async function post(req: Request, res: Response, next: NextFunction) {
  try {
    const courseId = parseInt(req.params.courseId, 10)
    const categoryScoreDto: CategoryScorePost = req.body
    categoryScoreDto.courseId = courseId

    const newCategoryScore = await CategoryScoreService.create(categoryScoreDto)

    const response = serialize(newCategoryScore)
    res.status(201).json(response)
  } catch (err) {
    next(err)
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10)
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid category score ID format' })
    }

    const categoryScoreDto: CategoryScorePatch = req.body
    const results = await CategoryScoreService.update(id, categoryScoreDto)

    if (!results.affected || results.affected === 0) {
      return res.status(404).json(NotFound)
    }

    res.status(200).json(Updated)
  } catch (err) {
    next(err)
  }
}

export async function _delete(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10)
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid category score ID format' })
    }

    const results = await CategoryScoreService._delete(id)

    if (!results.affected || results.affected === 0) {
      return res.status(404).json(NotFound)
    }

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export default {
  listByCourse,
  detailById,
  detailByName,
  post,
  update,
  _delete,
}