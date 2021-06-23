import { MigrationInterface, QueryRunner } from 'typeorm'

export class tightenUpUserModel1623375449310 implements MigrationInterface {
  name = 'tightenUpUserModel1623375449310'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "schoolId"`)
    await queryRunner.query(`ALTER TABLE "users" ADD "externalId" character varying(320) NOT NULL`)
    await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "unique_user_externaId" UNIQUE ("externalId")`)
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`)
    await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying(320) NOT NULL`)
    await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "unique_user_email" UNIQUE ("email")`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "unique_user_email"`)
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`)
    await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying(128) NOT NULL`)
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "unique_user_externaId"`)
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "externalId"`)
    await queryRunner.query(`ALTER TABLE "users" ADD "schoolId" character varying(128)`)
  }
}
