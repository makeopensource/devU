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

import AssignmentModel from '../assignment/assignment.model'

@Entity('assignment_problems')
export default class AssignmentProblemModel {
  /**
   * @swagger
   * tags:
   *   - name: AssignmentProblems
   *     description:
   * components:
   *  schemas:
   *    AssignmentProblem:
   *      type: object
   *      required: [assignmentId, problemName, maxScore]
   *      properties:
   *        assignmentId:
   *          type: integer
   *        problemName:
   *          type: string
   *        metadata:
   *          type: string
   *          description: A json string containing additional problem metadata
   *        maxScore:
   *          type: integer
   */

  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'assignment_id' })
  @JoinColumn({ name: 'assignment_id' })
  @ManyToOne(() => AssignmentModel)
  assignmentId: number

  @Column({ name: 'problem_name', length: 128 })
  problemName: string

  @Column({ name: 'metadata', type: 'jsonb', nullable: true, default: {} })
  metadata: any // use any since this can be any arbitrary structure

  @Column({ name: 'max_score' })
  maxScore: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date
}
