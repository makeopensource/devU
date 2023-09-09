import { SubmissionType, submissionTypes } from 'devu-shared-modules'

import {
  JoinColumn,
  ManyToOne,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm'

import AssignmentModel from './assignment.model'
import CourseModel from './course.model'
import UserModel from './user.model'

@Entity('submissions')
export default class Submission {
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

  @Column({ name: 'assignment_id' })
  @JoinColumn({ name: 'assignment_id' })
  @ManyToOne(() => AssignmentModel)
  assignmentId: number

  @Column({ name: 'user_id' })
  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => UserModel)
  userId: number

  @Column({ name: 'content' })
  content: string

  @Column({ name: 'type', type: 'enum', enum: submissionTypes })
  type: SubmissionType

  // Should never be set by anyone other than the API
  @Column({ name: 'submitter_ip', length: 64 })
  submitterIp: string

  // Hard overridden by the API - only differs from userId when someone submits on behalf of another user (regrade)
  @Column({ name: 'submitted_by' })
  @JoinColumn({ name: 'submitted_by' })
  @ManyToOne(() => UserModel)
  submittedBy: number

  // If this field is populated it means that this submission is a regraded assignment. If null it's a normal submission
  @Column({ name: 'original_submission_id', type: 'int', nullable: true })
  @JoinColumn({ name: 'original_submission_id' })
  @ManyToOne(() => Submission)
  originalSubmissionId: number | null
}
