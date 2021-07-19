import { GradingType, gradingTypes } from 'devu-shared-modules'

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

import CourseModel from './courses.model'

@Entity('assignments')
export default class Assignment {
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

  @Column({ name: 'grading_type', type: 'enum', enum: gradingTypes })
  gradingType: GradingType

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
}
