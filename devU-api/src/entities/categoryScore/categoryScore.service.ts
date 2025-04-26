import { DeleteResult, IsNull, UpdateResult } from 'typeorm'
import { dataSource } from '../../database'

import CategoryScoreModel from './categoryScore.model'

// Import DTOs and Enum
import { CategoryScorePatch, CategoryScorePost } from 'devu-shared-modules'

// Helper function to get the repository
const getRepository = () => dataSource.getRepository(CategoryScoreModel)

/**
 * Creates a new category score record using data from the DTO.
 *
 * @param {CategoryScorePost} categoryScoreDto - The DTO containing data for the new category score.
 * @returns {Promise<CategoryScoreModel>} The created CategoryScore entity from the database.
 */
export async function create(categoryScoreDto: CategoryScorePost): Promise<CategoryScoreModel> {
  const newScore = getRepository().create(categoryScoreDto)
  return await getRepository().save(newScore)
}

/**
 * Updates an existing category score record.
 *
 * @param {number} id - The ID of the category score to update.
 * @param {CategoryScorePatch} categoryScoreDto - A DTO containing the fields to update.
 * @returns {Promise<UpdateResult>} The result of the update operation from TypeORM.
 * @throws {Error} Throws an error if the id is missing.
 */
export async function update(id: number, categoryScoreDto: CategoryScorePatch): Promise<UpdateResult> {
  return await getRepository().update(id, categoryScoreDto)
}

/**
 * Soft deletes a category score record by setting the deletedAt timestamp.
 *
 * @param {number} id - The ID of the category score to soft delete.
 * @returns {Promise<DeleteResult>} The result of the soft delete operation from TypeORM.
 */
export async function _delete(id: number): Promise<DeleteResult> {
  return await getRepository().softDelete(id)
}

/**
 * Retrieves a single category score record by its ID, excluding soft-deleted records.
 *
 * @param {number} id - The ID of the category score to retrieve.
 * @returns {Promise<CategoryScoreModel | null>} The found CategoryScore entity or null if not found.
 */
export async function retrieve(id: number): Promise<CategoryScoreModel | null> {
  return await getRepository().findOneBy({ id, deletedAt: IsNull() })
}


/**
 * Retrieves a single category score record by its name, excluding soft-deleted records.
 *
 * @returns {Promise<CategoryScoreModel | null>} The found CategoryScore entity or null if not found.
 * @param category - name of the category
 */
export async function retrieveByName(category: string): Promise<CategoryScoreModel | null> {
  return await getRepository().findOneBy({ category, deletedAt: IsNull() })
}


/**
 * Retrieves all non-soft-deleted category score records for a specific course.
 *
 * @param {number} courseId - The ID of the course.
 * @returns {Promise<CategoryScoreModel[]>} A list of active CategoryScore entities for the specified course.
 */
export async function listByCourse(courseId: number): Promise<CategoryScoreModel[]> {
  return await getRepository().findBy({ courseId, deletedAt: IsNull() })
}

export default {
  create,
  retrieve,
  update,
  _delete,
  listByCourse,
  retrieveByName,
}