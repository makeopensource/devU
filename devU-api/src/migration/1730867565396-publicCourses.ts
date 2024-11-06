import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1730867565396 implements MigrationInterface {
    name = 'Migration1730867565396'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" ADD "is_public" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "courses" ADD "private_data" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "private_data"`);
        await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "is_public"`);
    }

}
