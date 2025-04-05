import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMetadataToNCAG1741738490302 implements MigrationInterface {
    name = 'AddMetadataToNCAG1741738490302'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nonContainerAutoGrader" ADD "metadata" jsonb DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nonContainerAutoGrader" DROP COLUMN "metadata"`);
    }

}
