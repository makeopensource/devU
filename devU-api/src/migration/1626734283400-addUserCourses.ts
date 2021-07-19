import { MigrationInterface, QueryRunner } from 'typeorm'

export class addUserCourses1626734283400 implements MigrationInterface {
  name = 'addUserCourses1626734283400'

  // prettier-ignore
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "user_courses_type_enum" AS ENUM('student', 'ta', 'instructor')`)

    await queryRunner.query(`CREATE TABLE "user_courses" (
        "id" SERIAL NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "user_id" integer NOT NULL,
        "course_id" integer NOT NULL,
        "type" "user_courses_type_enum" NOT NULL,
        "dropped" boolean NOT NULL,
        CONSTRAINT "user_courses_primary_key_constraint" PRIMARY KEY ("id")
    )`)

    await queryRunner.query(`ALTER TABLE "user_courses" ADD CONSTRAINT "user_courses_to_users_foreign_key_constraint" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await queryRunner.query(`ALTER TABLE "user_courses" ADD CONSTRAINT "user_courses_to_courses_foreign_key_constraint" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_courses" DROP CONSTRAINT "user_courses_to_courses_foreign_key_constraint"`
    )
    await queryRunner.query(`ALTER TABLE "user_courses" DROP CONSTRAINT "user_courses_to_users_foreign_key_constraint"`)
    await queryRunner.query(`DROP TABLE "user_courses"`)
    await queryRunner.query(`DROP TYPE "user_courses_type_enum"`)
  }
}
