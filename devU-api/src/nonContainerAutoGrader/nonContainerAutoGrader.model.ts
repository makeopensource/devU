import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn, JoinColumn, OneToOne,
} from 'typeorm'
import AssignmentModel from '../assignment/assignment.model'

@Entity('nonContainerAutoGrader')
export default class NonContainerAutoGraderModel {
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
    question: string

    score: number

    @Column({ length: 128 })
    correctString: string
}
