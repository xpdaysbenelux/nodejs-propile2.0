import {MigrationInterface, QueryRunner} from "typeorm";

export class AddDefaultToRoles1581503132352 implements MigrationInterface {
    name = 'AddDefaultToRoles1581503132352'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "role" ADD "isDefault" boolean NOT NULL DEFAULT false`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "isDefault"`, undefined);
    }

}
