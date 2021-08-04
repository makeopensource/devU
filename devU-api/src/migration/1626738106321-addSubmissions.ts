import { MigrationInterface, QueryRunner } from 'typeorm'

export class addSubmissions1626738106321 implements MigrationInterface {
  name = 'addSubmissions1626738106321'

  // prettier-ignore
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "submissions_type_enum" AS ENUM('filepath', 'json', 'text')`);

    await queryRunner.query(`CREATE TABLE "submissions" (
        "id" SERIAL NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "course_id" integer NOT NULL,
        "assignment_id" integer NOT NULL,
        "user_id" integer NOT NULL,
        "submitted_by" integer NOT NULL,
        "original_submission_id" integer,
        "type" "submissions_type_enum" NOT NULL,
        "content" character varying NOT NULL,
        "submitter_ip" character varying(64) NOT NULL,
        CONSTRAINT "submissions_primary_key_constraint" PRIMARY KEY ("id")
    )`);

    await queryRunner.query(`ALTER TABLE "submissions" ADD CONSTRAINT "submissions_to_courses_foreign_key_constraint" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "submissions" ADD CONSTRAINT "submissions_to_assignments_foreign_key_constraint" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "submissions" ADD CONSTRAINT "submissions_to_users_user_id_foreign_key_constraint" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "submissions" ADD CONSTRAINT "submissions_to_users_submitter_id_foreign_key_constraint" FOREIGN KEY ("submitted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "submissions" ADD CONSTRAINT "submissions_to_submissions_foreign_key_constraint" FOREIGN KEY ("original_submission_id") REFERENCES "submissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  // prettier-ignore
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "submissions_to_submissions_foreign_key_constraint"`);
    await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "submissions_to_users_user_id_foreign_key_constraint"`);
    await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "submissions_to_users_submitted_by_foreign_key_constraint"`);
    await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "submissions_to_assignments_foreign_key_constraint"`);
    await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "submissions_to_courses_foreign_key_constraint"`);
    await queryRunner.query(`DROP TABLE "submissions"`);

    await queryRunner.query(`DROP TYPE "submissions_type_enum"`);
  }
}
