import { MigrationInterface, QueryRunner } from "typeorm";

export class AddScoringType1744570382000 implements MigrationInterface {
    name = 'AddScoringType1744570382000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."assignments_scoring_type_enum" AS ENUM('highest-score', 'latest-submission', 'no-score')`);
        await queryRunner.query(`ALTER TABLE "assignments" ADD "scoring_type" "public"."assignments_scoring_type_enum" NOT NULL DEFAULT 'highest-score'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assignments" DROP COLUMN "scoring_type"`);
        await queryRunner.query(`DROP TYPE "public"."assignments_scoring_type_enum"`);
    }

}
