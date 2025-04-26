import { MigrationInterface, QueryRunner } from "typeorm";

export class MoveMetadataToAssignmentProblem1743961277791 implements MigrationInterface {
    name = 'MoveMetadataToAssignmentProblem1743961277791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nonContainerAutoGrader" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "assignment_problems" ADD "metadata" jsonb DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "FilesAuth" ALTER COLUMN "etag" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "FilesAuth" ALTER COLUMN "name" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "FilesAuth" ALTER COLUMN "type" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "FilesAuth" ALTER COLUMN "filename" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "FilesAuth" ALTER COLUMN "bucket" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "FilesAuth" ALTER COLUMN "bucket" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "FilesAuth" ALTER COLUMN "filename" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "FilesAuth" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "FilesAuth" ALTER COLUMN "name" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "FilesAuth" ALTER COLUMN "etag" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "assignment_problems" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "nonContainerAutoGrader" ADD "metadata" jsonb DEFAULT '{}'`);
    }

}
