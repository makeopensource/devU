import { MigrationInterface, QueryRunner } from 'typeorm'

export class renameUserColumns1623389391024 implements MigrationInterface {
  name = 'renameUserColumns1623389391024'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "createdAt" TO "created_at"`)
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "updatedAt" TO "updated_at"`)
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "deletedAt" TO "deleted_at"`)
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "preferredName" TO "preferred_name"`)
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "externalId" TO "external_id"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "created_at" TO "createdAt"`)
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "updated_at" TO "updatedAt"`)
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "deleted_at" TO "deletedAt"`)
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "preferred_name" TO "preferredName"`)
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "external_id" TO "externalId"`)
  }
}
