import { MigrationInterface, QueryRunner } from 'typeorm'

export class addSubmissionProblemScores1665020208581 implements MigrationInterface {
  name = 'addSubmissionProblemScores1665020208581'

  // prettier-ignore
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "assignments" DROP CONSTRAINT "assignments_to_courses_foreign_key_constraint"`)
    await queryRunner.query(`ALTER TABLE "assignment_problems" DROP CONSTRAINT "assignment_problems_to_assignment_id_foreign_key_constraint"`)
    await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "submissions_to_course_id_foreign_key_constraint"`)
    await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "submissions_to_assignment_id_foreign_key_constraint"`)
    await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "submissions_to_user_id_foreign_key_constraint"`)
    await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "submissions_to_submitted_by_user_id_foreign_key_constraint"`)
    await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "submissions_to_original_submission_id_foreign_key_constraint"`)
    await queryRunner.query(`ALTER TABLE "user_courses" DROP CONSTRAINT "user_courses_to_user_id_foreign_key_constraint"`)
    await queryRunner.query(`ALTER TABLE "user_courses" DROP CONSTRAINT "user_courses_to_course_id_foreign_key_constraint"`)

    await queryRunner.query(`CREATE TABLE "submission_problem_scores" (
            "id" SERIAL NOT NULL, 
            "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "deleted_at" TIMESTAMP, 
            "submission_id" integer NOT NULL, 
            "assignment_problem_id" integer NOT NULL, 
            "score" double precision, 
            "feedback" text, 
            "released_at" TIMESTAMP, 
            CONSTRAINT "submission_problem_scores_primary_key_constraint" PRIMARY KEY ("id")
            )`)

    await queryRunner.query(`ALTER TABLE "assignments" ADD CONSTRAINT "assignments_to_courses_foreign_key_constraint" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "assignment_problems" ADD CONSTRAINT "assignment_problems_to_assignment_id_foreign_key_constraint" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "submissions" ADD CONSTRAINT "submissions_to_course_id_foreign_key_constraint" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "submissions" ADD CONSTRAINT "submissions_to_assignment_id_foreign_key_constraint" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "submissions" ADD CONSTRAINT "submissions_to_user_id_foreign_key_constraint" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "submissions" ADD CONSTRAINT "submissions_to_submitted_by_user_id_foreign_key_constraint" FOREIGN KEY ("submitted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "submissions" ADD CONSTRAINT "submissions_to_original_submission_id_foreign_key_constraint" FOREIGN KEY ("original_submission_id") REFERENCES "submissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "submission_problem_scores" ADD CONSTRAINT "submission_problem_scores_to_submission_id_foreign_key_constraint" FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "submission_problem_scores" ADD CONSTRAINT "submission_problem_scores_to_assignment_problem_id_foreign_key_constraint" FOREIGN KEY ("assignment_problem_id") REFERENCES "assignment_problems"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "user_courses" ADD CONSTRAINT "user_courses_to_user_id_foreign_key_constraint" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "user_courses" ADD CONSTRAINT "user_courses_to_course_id_foreign_key_constraint" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  // prettier-ignore
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_courses" DROP CONSTRAINT "user_courses_to_course_id_foreign_key_constraint"`)
    await queryRunner.query(`ALTER TABLE "user_courses" DROP CONSTRAINT "user_courses_to_user_id_foreign_key_constraint"`)
    await queryRunner.query(`ALTER TABLE "submission_problem_scores" DROP CONSTRAINT "submission_problem_scores_to_submission_id_foreign_key_constraint"`)
    await queryRunner.query(`ALTER TABLE "submission_problem_scores" DROP CONSTRAINT "submission_problem_scores_to_assignment_problem_id_foreign_key_constraint"`)
    await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "submissions_to_original_submission_id_foreign_key_constraint"`)
    await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "submissions_to_submitted_by_user_id_foreign_key_constraint"`)
    await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "submissions_to_user_id_foreign_key_constraint"`)
    await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "submissions_to_assignment_id_foreign_key_constraint"`)
    await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "submissions_to_course_id_foreign_key_constraint"`)
    await queryRunner.query(`ALTER TABLE "assignment_problems" DROP CONSTRAINT "assignment_problems_to_assignment_id_foreign_key_constraint"`)
    await queryRunner.query(`ALTER TABLE "assignments" DROP CONSTRAINT "assignments_to_courses_foreign_key_constraint"`)
    await queryRunner.query(`DROP TABLE "submission_problem_scores"`)
    await queryRunner.query(`ALTER TABLE "user_courses" ADD CONSTRAINT "user_courses_to_course_id_foreign_key_constraint" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "user_courses" ADD CONSTRAINT "user_courses_to_user_id_foreign_key_constraint" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "submissions" ADD CONSTRAINT "submissions_to_original_submission_id_foreign_key_constraint" FOREIGN KEY ("original_submission_id") REFERENCES "submissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "submissions" ADD CONSTRAINT "submissions_to_submitted_by_user_id_foreign_key_constraint" FOREIGN KEY ("submitted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "submissions" ADD CONSTRAINT "submissions_to_user_id_foreign_key_constraint" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "submissions" ADD CONSTRAINT "submissions_to_assignment_id_foreign_key_constraint" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "submissions" ADD CONSTRAINT "submissions_to_course_id_foreign_key_constraint" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "assignment_problems" ADD CONSTRAINT "assignment_problems_to_assignment_id_foreign_key_constraint" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "assignments" ADD CONSTRAINT "assignments_to_courses_foreign_key_constraint" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }
}
