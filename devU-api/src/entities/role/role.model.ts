import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    JoinColumn,
    ManyToOne
} from 'typeorm'

import CourseModel from '../course/course.model'
import UserModel from '../user/user.model'

@Entity('courseScore')
export default class CourseScoreModel {
    /**
     * @swagger
     * tags:
     *   - name: Role
     * components:
     *  schemas:
     *    Role:
     *      type: object
     *      required: []
     *      properties:
     *        permission:
     *          type: boolean
     */
    @PrimaryGeneratedColumn()
    id: number

    @Column({name: 'course_id'})
    @JoinColumn({name: 'course_id'})
    @ManyToOne(() => CourseModel)
    courseId: number


    @Column({name: 'user_id'})
    @JoinColumn({name: 'user_id'})
    @ManyToOne(() => UserModel)
    userId: number

    @Column({name: 'name'})
    score: string

    @Column({name: 'grades-view'})
    grades_view: boolean

    @Column({name: 'grades-edit'})
    grades_edit: boolean

    @Column({name: 'grades-view-self'})
    grades_viewSelf: boolean

    @Column({name: 'grades-edit-self'})
    grades_editSelf: boolean

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date

    @DeleteDateColumn({name: 'deleted_at'})
    deletedAt?: Date

}

