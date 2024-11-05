import { MigrationInterface, QueryRunner } from 'typeorm'

export class addAssignmentsAndCourses1626719306608 implements MigrationInterface {
  name = 'addAssignmentsAndCourses1626719306608'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "courses" (
          "id" SERIAL NOT NULL,
          "name" character varying(128) NOT NULL,
          "semester" character varying(16) NOT NULL,
          "number" character varying(128) NOT NULL,
          "start_date" TIMESTAMP NOT NULL,
          "end_date" TIMESTAMP NOT NULL,
          "created_at" TIMESTAMP NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
          "deleted_at" TIMESTAMP,
          "is_public" boolean NOT NULL DEFAULT false,
          CONSTRAINT "courses_primary_key_constraint" PRIMARY KEY ("id")
      )`
    )

    await queryRunner.query(`CREATE TYPE "assignments_grading_type_enum" AS ENUM('code', 'non-code', 'manual')`)

    await queryRunner.query(
      `CREATE TABLE "assignments" (
          "id" SERIAL NOT NULL,
          "course_id" integer NOT NULL,
          "name" character varying(128) NOT NULL,
          "start_date" TIMESTAMP NOT NULL,
          "due_date" TIMESTAMP NOT NULL,
          "end_date" TIMESTAMP NOT NULL,
          "grading_type" "assignments_grading_type_enum" NOT NULL,
          "category_name" character varying(128) NOT NULL,
          "description" text,
          "max_file_size" integer NOT NULL,
          "max_submissions" integer,
          "disable_handins" boolean NOT NULL,
          "created_at" TIMESTAMP NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
          "deleted_at" TIMESTAMP,
          CONSTRAINT "assignments_primary_key_constraint" PRIMARY KEY ("id")
      )`
    )

    await queryRunner.query(
      `ALTER TABLE "assignments" ADD CONSTRAINT "assignments_to_courses_foreign_key_constraint" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "assignments" DROP CONSTRAINT "assignments_to_courses_foreign_key_constraint"`)
    await queryRunner.query(`DROP TABLE "assignments"`)
    await queryRunner.query(`DROP TYPE "assignments_grading_type_enum"`)
    await queryRunner.query(`DROP TABLE "courses"`)
  }
}
