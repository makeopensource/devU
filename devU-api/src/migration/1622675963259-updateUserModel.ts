import { MigrationInterface, QueryRunner } from 'typeorm'

export class updateUserModel1622675963259 implements MigrationInterface {
  name = 'updateUserModel1622675963259'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`)
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`)
    await queryRunner.query(`ALTER TABLE "users" ADD "schoolId" character varying(128)`)
    await queryRunner.query(`ALTER TABLE "users" ADD "preferredName" character varying(128)`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "preferredName"`)
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "schoolId"`)
    await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying(128) NOT NULL`)
    await queryRunner.query(`ALTER TABLE "users" ADD "username" character varying(32) NOT NULL`)
  }
}
