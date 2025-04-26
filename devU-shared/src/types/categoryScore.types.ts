export enum CategoryScoreGradeType {
  AVERAGE = 'AVERAGE',
  SUM = 'SUM',
}

export type CategoryScore = {
  id: number;
  createdAt: string;
  updatedAt: string;
  courseId: number;
  category: string
  gradingType: CategoryScoreGradeType;
};

/**
 * @description DTO for creating a Category Score (POST request body).
 * Derivation: Omits server-generated fields ('id', 'createdAt', 'updatedAt') from the base type.
 * Fields included: userId, courseId, categoryId, gradingType, score?
 */
export type CategoryScorePost = Omit<CategoryScore, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * @description DTO for updating a Category Score (PATCH request body).
 * Derivation: Takes the fields allowed for creation (using CategoryScorePost),
 * and makes all of them optional using Partial<>.
 * Fields included: userId?, courseId?, categoryId?, score?, gradingType?
 */
export type CategoryScorePatch = Partial<Pick<CategoryScore, 'courseId' | 'category' | 'gradingType'>>;


/**
 * @description DTO for retrieving a Category Score (GET response body).
 * Derivation: Takes the base CategoryScore type and makes the server-managed
 * fields ('id', 'createdAt', 'updatedAt') required, as they will always exist
 * on a retrieved record. Uses an intersection (&) with Required<Pick<...>>.
 * Fields included: id, userId, courseId, categoryId, score?, gradingType, createdAt, updatedAt
 */
export type CategoryScoreGet = CategoryScore & Required<Pick<CategoryScore, 'id' | 'createdAt' | 'updatedAt'>>;
