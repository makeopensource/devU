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
import AssignmentModel from '../assignment/assignment.model'

@Entity({ name: 'nonContainerAutoGrader' })
export default class NonContainerAutoGraderModel {
  /**
   * @swagger
   * tags:
   *   - name: NonContainerAutoGraders
   *     description:
   * components:
   *  schemas:
   *    NonContainerAutoGrader:
   *      type: object
   *      required: [assignmentId, question, score, correctString]
   *      properties:
   *        assignmentId:
   *          type: integer
   *        question:
   *          type: string
   *        metadata:
   *          type: any
   *          description: this contains a valid json string tha contains info about any arbitrary question type (MCQ, Fill in the blanks etc.)
   *        score:
   *          type: number
   *        correctString:
   *          type: string
   */

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
  @ManyToOne(() => AssignmentModel)
  assignmentId: number

  @Column({ name: 'question', length: 128 })
  question: string

  @Column({ name: 'metadata', type: 'jsonb', nullable: true, default: {} })
  metadata: any // use any since this can be any arbitrary structure

  @Column({ name: 'score' })
  score: number

  @Column({ name: 'is_regex', type: 'boolean' })
  isRegex: boolean

  @Column({ name: 'correct_string', length: 128 })
  correctString: string
}
