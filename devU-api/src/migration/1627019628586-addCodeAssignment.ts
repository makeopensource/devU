import { MigrationInterface, QueryRunner } from 'typeorm'

export class addCodeAssignment1627019628586 implements MigrationInterface {
  name = 'addCodeAssignment1627019628586'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "code_assignment" (
        "id" SERIAL NOT NULL, 
        "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "deleted_at" TIMESTAMP, 
        "assignment_id" integer NOT NULL, 
        "grader" character varying(128) NOT NULL, 
        "gradingImage" character varying(128) NOT NULL, 
        CONSTRAINT "code_assignment_to_assignment_foreign_key_constraint" UNIQUE ("assignment_id"), 
        CONSTRAINT "code_assignment_primary_key_constraint" PRIMARY KEY ("id")
    )`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "code_assignment"`)
  }
}
