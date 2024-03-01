import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn, ManyToOne
} from 'typeorm'
import CourseModel from "../course/course.model";

@Entity('category')
export default class CategoryModel {
  /**
   * @swagger
   * tags:
   *   - name: Categories
   *     description: Route is currently non-functional, TS2305 error
   * components:
   *  schemas:
   *    Category:
   *      type: object
   *      required: [name]
   *      properties:
   *        name:
   *          type: string
   */
  @PrimaryGeneratedColumn()
  id: number

  @Column({name: 'course_id'})
  @JoinColumn({name: 'course_id'})
  @ManyToOne(() => CourseModel)
  courseId: number

  @Column({ length: 128 })
  name: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date
}