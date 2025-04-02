import {
  JoinColumn,
  ManyToOne,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Check,
} from 'typeorm'

import AssignmentModel from '../assignment/assignment.model'

@Entity('container_auto_grader')
export default class ContainerAutoGraderModel {
  /**
   * @swagger
   * tags:
   *   - name: ContainerAutoGraders
   *     description:
   * components:
   *  schemas:
   *    ContainerAutoGrader:
   *      type: object
   *      required: [assignmentId, dockerfileId, timeoutInSeconds, jobFileIds]
   *      properties:
   *        assignmentId:
   *          type: integer
   *        dockerfileId:
   *          type: string
   *          description: MinIO object ID for the uploaded Dockerfile
   *        jobFileIds:
   *          type: array
   *          items:
   *            type: string
   *          description: List of MinIO object IDs for uploaded job files
   *        timeoutInSeconds:
   *          type: integer
   *          description: Must be a positive integer greater than 0
   *        pidLimit:
   *          type: integer
   *          description: Maximum number of processes allowed in the container
   *        entryCmd:
   *          type: string
   *          description: Custom entry command for the container
   *        autolabCompatible:
   *          type: boolean
   *          description: Whether the container is compatible with autolab mode
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

  @Column({ name: 'dockerfile_id', length: 512 })
  dockerfileId: string

  @Column({ name: 'job_file_ids', type: 'jsonb', nullable: false, default: [] })
  jobFileIds: string[]

  @Column({ name: 'timeout_in_seconds' })
  @Check('timeout_in_seconds > 0')
  timeoutInSeconds: number

  @Column({ name: 'memory_limit_mb', default: 512 })
  memoryLimitMB: number

  @Column({ name: 'cpu_cores', default: 1 })
  cpuCores: number

  @Column({ name: 'pid_limit', default: 100 })
  pidLimit: number

  @Column({ name: 'entry_cmd', nullable: true })
  entryCmd?: string

  @Column({ name: 'autolab_compatible', default: true })
  autolabCompatible: boolean
}
