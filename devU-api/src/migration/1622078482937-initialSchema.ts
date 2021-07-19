import { MigrationInterface, QueryRunner } from 'typeorm'

export class initialSchema1622078482937 implements MigrationInterface {
  name = 'initialSchema1622078482937'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "username" character varying(32) NOT NULL, "name" character varying(128) NOT NULL, "email" character varying(128) NOT NULL, CONSTRAINT "users_primary_key_constraint" PRIMARY KEY ("id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`)
  }
}
