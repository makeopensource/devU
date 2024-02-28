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

import { UserCourseLevel, userCourseLevels } from 'devu-shared-modules'

import UserModel from '../user/user.model'
import CourseModel from '../course/course.model'

@Entity('user_courses')
export default class UserCourseModel {
  /**
   * @swagger
   * tags:
   *   - name: UserCourses
   *     description: GET /user/{user-id} does not function properly, only returns empty set []
   * components:
   *  schemas:
   *    UserCourse:
   *      type: object
   *      required: [userId, courseId, level]
   *      properties:
   *        userId:
   *          type: integer
   *        courseId:
   *          type: integer
   *        level:
   *          type: string
   *          description: Must be either "student", "ta", or "instructor"
   */
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date

  @Column({ name: 'user_id' })
  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => UserModel)
  userId: number

  @Column({ name: 'course_id' })
  @JoinColumn({ name: 'course_id' })
  @ManyToOne(() => CourseModel)
  courseId: number

  @Column({ name: 'type', type: 'enum', enum: userCourseLevels })
  level: UserCourseLevel

  @Column()
  dropped: boolean
}
