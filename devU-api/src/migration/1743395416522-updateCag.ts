import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCag1743395416522 implements MigrationInterface {
    name = 'UpdateCag1743395416522'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "container_auto_grader" DROP COLUMN "timeout"`);
        await queryRunner.query(`ALTER TABLE "container_auto_grader" DROP COLUMN "makefile_filename"`);
        await queryRunner.query(`ALTER TABLE "container_auto_grader" DROP COLUMN "autograding_image"`);
        await queryRunner.query(`ALTER TABLE "container_auto_grader" DROP COLUMN "grader_filename"`);
        await queryRunner.query(`ALTER TABLE "FilesAuth" ADD "etag" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "FilesAuth" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "FilesAuth" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "container_auto_grader" ADD "dockerfile_id" character varying(512) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "container_auto_grader" ADD "job_file_ids" jsonb NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "container_auto_grader" ADD "timeout_in_seconds" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "container_auto_grader" ADD "memory_limit_mb" integer NOT NULL DEFAULT '512'`);
        await queryRunner.query(`ALTER TABLE "container_auto_grader" ADD "cpu_cores" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "container_auto_grader" ADD "pid_limit" integer NOT NULL DEFAULT '100'`);
        await queryRunner.query(`ALTER TABLE "container_auto_grader" ADD "entry_cmd" character varying`);
        await queryRunner.query(`ALTER TABLE "container_auto_grader" ADD "autolab_compatible" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "container_auto_grader" ADD CONSTRAINT "CHK_e72da9ff159109a7c3f9afda10" CHECK (timeout_in_seconds > 0)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "container_auto_grader" DROP CONSTRAINT "CHK_e72da9ff159109a7c3f9afda10"`);
        await queryRunner.query(`ALTER TABLE "container_auto_grader" DROP COLUMN "autolab_compatible"`);
        await queryRunner.query(`ALTER TABLE "container_auto_grader" DROP COLUMN "entry_cmd"`);
        await queryRunner.query(`ALTER TABLE "container_auto_grader" DROP COLUMN "pid_limit"`);
        await queryRunner.query(`ALTER TABLE "container_auto_grader" DROP COLUMN "cpu_cores"`);
        await queryRunner.query(`ALTER TABLE "container_auto_grader" DROP COLUMN "memory_limit_mb"`);
        await queryRunner.query(`ALTER TABLE "container_auto_grader" DROP COLUMN "timeout_in_seconds"`);
        await queryRunner.query(`ALTER TABLE "container_auto_grader" DROP COLUMN "job_file_ids"`);
        await queryRunner.query(`ALTER TABLE "container_auto_grader" DROP COLUMN "dockerfile_id"`);
        await queryRunner.query(`ALTER TABLE "FilesAuth" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "FilesAuth" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "FilesAuth" DROP COLUMN "etag"`);
        await queryRunner.query(`ALTER TABLE "container_auto_grader" ADD "grader_filename" character varying(128) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "container_auto_grader" ADD "autograding_image" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "container_auto_grader" ADD "makefile_filename" text`);
        await queryRunner.query(`ALTER TABLE "container_auto_grader" ADD "timeout" integer NOT NULL`);
    }

}
