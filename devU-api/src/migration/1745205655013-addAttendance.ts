import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAttendance1745205655013 implements MigrationInterface {
    name = 'AddAttendance1745205655013'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "attendance_sessions" ("id" SERIAL NOT NULL, "course_id" integer NOT NULL, "created_by" integer NOT NULL, "attendance_code" character varying(16) NOT NULL, "time_limit_seconds" integer NOT NULL, "max_tries" integer NOT NULL DEFAULT '1', "expires_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_84d565d9e484e2bcdaf4a9e1890" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_df2696f9e2c2a585b3d0bc72e3" ON "attendance_sessions" ("attendance_code") `);
        await queryRunner.query(`CREATE TABLE "attendance_submissions" ("id" SERIAL NOT NULL, "attendance_session_id" integer NOT NULL, "submission_user_id" integer NOT NULL, "is_successful" boolean NOT NULL, "submission" character varying NOT NULL, "submitted_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_79a0df2851dd787ef2a2667d689" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_93b654701aec5a463ace90c167" ON "attendance_submissions" ("attendance_session_id", "submission_user_id") `);
        await queryRunner.query(`ALTER TABLE "attendance_sessions" ADD CONSTRAINT "FK_7d746b29a78bccf70780a37c125" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendance_sessions" ADD CONSTRAINT "FK_74917a50dbf4f21df5a115ca9e7" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendance_submissions" ADD CONSTRAINT "FK_384285024433aa85e174508aec6" FOREIGN KEY ("attendance_session_id") REFERENCES "attendance_sessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendance_submissions" ADD CONSTRAINT "FK_eb58bbfa203185ecdb091f12fda" FOREIGN KEY ("submission_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attendance_submissions" DROP CONSTRAINT "FK_eb58bbfa203185ecdb091f12fda"`);
        await queryRunner.query(`ALTER TABLE "attendance_submissions" DROP CONSTRAINT "FK_384285024433aa85e174508aec6"`);
        await queryRunner.query(`ALTER TABLE "attendance_sessions" DROP CONSTRAINT "FK_74917a50dbf4f21df5a115ca9e7"`);
        await queryRunner.query(`ALTER TABLE "attendance_sessions" DROP CONSTRAINT "FK_7d746b29a78bccf70780a37c125"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_93b654701aec5a463ace90c167"`);
        await queryRunner.query(`DROP TABLE "attendance_submissions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_df2696f9e2c2a585b3d0bc72e3"`);
        await queryRunner.query(`DROP TABLE "attendance_sessions"`);
    }

}
