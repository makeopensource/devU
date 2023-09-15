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

import AssignmentModel from './assignments.model'
import UserModel from './users.model'

@Entity('assignment_scores')
export default class AssignmentScore {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'assignment_id'})
    @JoinColumn({ name: 'assignment_id'})
    @ManyToOne( () => AssignmentModel)
    assignmentId: number

    @Column({ name: 'user_id'})
    @JoinColumn({ name: 'user_id'})
    @ManyToOne( () => UserModel)
    userId: number

    @Column({ name: 'score'})
    score: number

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date
  
    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt?: Date
    
}