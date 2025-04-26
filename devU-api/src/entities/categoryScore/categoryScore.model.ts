import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import CourseModel from '../course/course.model'
import { CategoryScoreGradeType } from 'devu-shared-modules'

@Entity('category_score')
export default class CategoryScoreModel {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date

  @Column({ name: 'course_id' })
  @JoinColumn({ name: 'course_id' })
  @ManyToOne(() => CourseModel)
  courseId: number

  @Column({ name: 'category_name' })
  category: string

  @Column({
    type: 'enum',
    enum: CategoryScoreGradeType,
    default: CategoryScoreGradeType.AVERAGE,
    name: 'category_scoring_type',
  })
  categoryScoringType: CategoryScoreGradeType
}
