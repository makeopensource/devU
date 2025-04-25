import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import CourseModel from '../course/course.model'
import UserModel from '../user/user.model'

@Entity('attendance_sessions')
export default class AttendanceSessionModel {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'course_id' })
  courseId: number

  @ManyToOne(() => CourseModel)
  @JoinColumn({ name: 'course_id' })
  course: CourseModel

  @Column({ name: 'created_by' })
  createdByUserId: number

  @ManyToOne(() => UserModel)
  @JoinColumn({ name: 'created_by' })
  instructor: UserModel

  @Index()
  @Column({ name: 'attendance_code', length: 16 })
  attendanceCode: string

  @Column({ name: 'time_limit_seconds' })
  timeLimitSeconds: number

  @Column({ name: 'max_tries', default: 1 })
  maxTries: number

  @Column({ name: 'expires_at' })
  expiresAt: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date
}
