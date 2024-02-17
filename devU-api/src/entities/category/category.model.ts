import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm'

@Entity('category')
export default class CategoryModel {
  /**
   * @swagger
   * tags:
   *   - name: Categories
   *     description: Route is currently non-functional, TS2305 error (Issue #34)
   * components:
   *  schemas:
   *    Category:
   *      type: object
   *      required: [name]
   *      properties:
   *        name:
   *          type: string
   */
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 128 })
  name: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date
}