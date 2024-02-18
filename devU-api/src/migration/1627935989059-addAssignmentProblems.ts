import { MigrationInterface, QueryRunner } from 'typeorm'

export class addAssignmentProblems1627935989059 implements MigrationInterface {
  name = 'addAssignmentProblems1627935989059'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "assignments" DROP CONSTRAINT "assignments_to_courses_foreign_key_constraint"`)
    await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "submissions_to_courses_foreign_key_constraint"`)
    await queryRunner.query(
      `ALTER TABLE "submissions" DROP CONSTRAINT "submissions_to_assignments_foreign_key_constraint"`
    )
    await queryRunner.query(
      `ALTER TABLE "submissions" DROP CONSTRAINT "submissions_to_users_user_id_foreign_key_constraint"`
    )
    await queryRunner.query(
      `ALTER TABLE "submissions" DROP CONSTRAINT "submissions_to_users_submitter_id_foreign_key_constraint"`
    )
    await queryRunner.query(
      `ALTER TABLE "submissions" DROP CONSTRAINT "submissions_to_submissions_foreign_key_constraint"`
    )
    await queryRunner.query(`ALTER TABLE "user_courses" DROP CONSTRAINT "user_courses_to_users_foreign_key_constraint"`)
    await queryRunner.query(
      `ALTER TABLE "user_courses" DROP CONSTRAINT "user_courses_to_courses_foreign_key_constraint"`
    )
    await queryRunner.query(
      `CREATE TABLE "assignment_problems" ("id" SERIAL NOT NULL, "assignment_id" integer NOT NULL, "problem_name" character varying(128) NOT NULL, "max_score" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "assignment_problems_primary_key_constraint" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "assignments" ADD CONSTRAINT "assignments_to_courses_foreign_key_constraint" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "assignment_problems" ADD CONSTRAINT "assignment_problems_to_assignment_id_foreign_key_constraint" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "submissions_to_course_id_foreign_key_constraint" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "submissions_to_assignment_id_foreign_key_constraint" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "submissions_to_user_id_foreign_key_constraint" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "submissions_to_submitted_by_user_id_foreign_key_constraint" FOREIGN KEY ("submitted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "submissions_to_original_submission_id_foreign_key_constraint" FOREIGN KEY ("original_submission_id") REFERENCES "submissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "user_courses" ADD CONSTRAINT "user_courses_to_user_id_foreign_key_constraint" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "user_courses" ADD CONSTRAINT "user_courses_to_course_id_foreign_key_constraint" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_courses" DROP CONSTRAINT "user_courses_to_course_id_foreign_key_constraint"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_courses" DROP CONSTRAINT "user_courses_to_user_id_foreign_key_constraint"`
    )
    await queryRunner.query(
      `ALTER TABLE "submissions" DROP CONSTRAINT "submissions_to_original_submission_id_foreign_key_constraint"`
    )
    await queryRunner.query(
      `ALTER TABLE "submissions" DROP CONSTRAINT "submissions_to_submitted_by_user_id_foreign_key_constraint"`
    )
    await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "submissions_to_user_id_foreign_key_constraint"`)
    await queryRunner.query(
      `ALTER TABLE "submissions" DROP CONSTRAINT "submissions_to_assignment_id_foreign_key_constraint"`
    )
    await queryRunner.query(
      `ALTER TABLE "submissions" DROP CONSTRAINT "submissions_to_course_id_foreign_key_constraint"`
    )
    await queryRunner.query(
      `ALTER TABLE "assignment_problems" DROP CONSTRAINT "assignment_problems_to_assignment_id_foreign_key_constraint"`
    )
    await queryRunner.query(`ALTER TABLE "assignments" DROP CONSTRAINT "assignments_to_courses_foreign_key_constraint"`)
    await queryRunner.query(`DROP TABLE "assignment_problems"`)
    await queryRunner.query(
      `ALTER TABLE "user_courses" ADD CONSTRAINT "user_courses_to_courses_foreign_key_constraint" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "user_courses" ADD CONSTRAINT "user_courses_to_users_foreign_key_constraint" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "submissions_to_submissions_foreign_key_constraint" FOREIGN KEY ("original_submission_id") REFERENCES "submissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "submissions_to_users_submitter_id_foreign_key_constraint" FOREIGN KEY ("submitted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "submissions_to_users_user_id_foreign_key_constraint" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "submissions_to_assignments_foreign_key_constraint" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "submissions_to_courses_foreign_key_constraint" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "assignments" ADD CONSTRAINT "assignments_to_courses_foreign_key_constraint" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
