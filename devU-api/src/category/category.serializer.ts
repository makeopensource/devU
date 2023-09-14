import { Category } from 'devu-shared-modules'

import CategoryModel from '../../model/category.model'

export function serialize(category: CategoryModel): Category {
  return {
    id: category.id,
    name: category.name,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  }
}