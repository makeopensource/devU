import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCategoryScore1745637057334 implements MigrationInterface {
    name = 'UpdateCategoryScore1745637057334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_score" DROP CONSTRAINT "FK_0a3a3e1ab14b8690e52939da390"`);
        await queryRunner.query(`ALTER TABLE "category_score" DROP CONSTRAINT "FK_41d5d4b618bbb9c9a2a0a4392a8"`);
        await queryRunner.query(`ALTER TABLE "category_score" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "category_score" DROP COLUMN "category_id"`);
        await queryRunner.query(`ALTER TABLE "category_score" DROP COLUMN "score"`);
        await queryRunner.query(`ALTER TABLE "category_score" ADD "category_name" character varying NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."category_score_category_scoring_type_enum" AS ENUM('AVERAGE', 'SUM')`);
        await queryRunner.query(`ALTER TABLE "category_score" ADD "category_scoring_type" "public"."category_score_category_scoring_type_enum" NOT NULL DEFAULT 'AVERAGE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_score" DROP COLUMN "category_scoring_type"`);
        await queryRunner.query(`DROP TYPE "public"."category_score_category_scoring_type_enum"`);
        await queryRunner.query(`ALTER TABLE "category_score" DROP COLUMN "category_name"`);
        await queryRunner.query(`ALTER TABLE "category_score" ADD "score" double precision`);
        await queryRunner.query(`ALTER TABLE "category_score" ADD "category_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "category_score" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "category_score" ADD CONSTRAINT "FK_41d5d4b618bbb9c9a2a0a4392a8" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category_score" ADD CONSTRAINT "FK_0a3a3e1ab14b8690e52939da390" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
