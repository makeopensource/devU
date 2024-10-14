import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'

import CourseModel from '../course/course.model'

@Entity('assignments')
export default class AssignmentModel {
  /**
   * @swagger
   * tags:
   *   - name: Assignments
   *     description:
   * components:
   *  schemas:
   *    Assignment:
   *      type: object
   *      required: [courseId, name, categoryName, maxFileSize, disableHandins, startDate, dueDate, endDate]
   *      properties:
   *        courseId:
   *          type: integer
   *        name:
   *          type: string
   *        categoryName:
   *          type: string
   *        description:
   *          type: string
   *        maxFileSize:
   *          type: integer
   *        maxSubmissions:
   *          type: integer
   *        disableHandins:
   *          type: boolean
   *        startDate:
   *          type: string
   *          format: date-time
   *          description: Must be in ISO 8601 format
   *        dueDate:
   *          type: string
   *          format: date-time
   *          description: Must be in ISO 8601 format
   *        endDate:
   *          type: string
   *          format: date-time
   *          description: Must be in ISO 8601 format
   */

  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'course_id' })
  @JoinColumn({ name: 'course_id' })
  @ManyToOne(() => CourseModel)
  courseId: number

  @Column({ length: 128 })
  name: string

  @Column({ name: 'start_date' })
  startDate: Date

  @Column({ name: 'due_date' })
  dueDate: Date

  @Column({ name: 'end_date' })
  endDate: Date

  @Column({ name: 'category_name', length: 128 })
  categoryName: string

  @Column({ nullable: true, type: 'text' })
  description: string | null

  @Column({ name: 'max_file_size' })
  maxFileSize: number

  @Column({ name: 'max_submissions', type: 'int', nullable: true })
  maxSubmissions: number | null

  @Column({ name: 'disable_handins' })
  disableHandins: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date

  @Column({ name: 'attachmentsHashes', array: true, default: [], type: 'text' })
  attachmentsHashes: string[]

  @Column({ name: 'attachmentsFilenames', array: true, default: [], type: 'text', nullable: false })
  attachmentsFilenames: string[]
}
