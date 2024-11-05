import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAssignmentsAndCourses16267193066081730826999182 implements MigrationInterface {
    name = 'AddAssignmentsAndCourses16267193066081730826999182'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" ADD "is_public" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "is_public"`);
    }

}
