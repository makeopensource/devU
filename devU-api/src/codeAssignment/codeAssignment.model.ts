import {
  JoinColumn,
  OneToOne,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm'

import AssignmentModel from '../assignment/assignment.model'

/**
 * One entity of this type is created for each assignment where the 'grading_type' is set to 'code'
 * This effectively adds information to a code assignment that is specific to the grading of code assignments,
 * specifically, the grader file and the docker image to be used during grading.
 *
 * There should be a 1-to-1 relation between CodeAssignments and Assignments with grading type code. Furthermore,
 * such assignments should not have and other such assignments types (eg. NonCodeAssignment, ManualAssignment).
 */
@Entity('code_assignments')
export default class CodeAssignmentModel {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date

  @Column({ name: 'assignment_id' })
  @JoinColumn({ name: 'assignment_id' })
  @OneToOne(() => AssignmentModel)
  assignmentId: number

  @Column({ length: 128 })
  grader: string

  @Column({ length: 128 })
  gradingImage: string
}
