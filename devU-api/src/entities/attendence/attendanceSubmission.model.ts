import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

// Import related models - Adjust paths as needed
import AttendanceSessionModel from './attendance.model'
import UserModel from '../user/user.model'

@Entity('attendance_submissions')
@Index(['attendanceSessionId', 'submissionUserId'])
export default class AttendanceSubmissionModel {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'attendance_session_id' })
  attendanceSessionId: number

  @ManyToOne(() => AttendanceSessionModel)
  @JoinColumn({ name: 'attendance_session_id' })
  attendanceSession: AttendanceSessionModel

  @Column({ name: 'submission_user_id' })
  submissionUserId: number

  @ManyToOne(() => UserModel)
  @JoinColumn({ name: 'submission_user_id' })
  user: UserModel

  @Column({ name: 'is_successful' })
  isSuccessful: boolean

  @Column({ name: 'submission' })
  submission: string

  @CreateDateColumn({ name: 'submitted_at', type: 'timestamp with time zone' })
  submittedAt: Date
}
