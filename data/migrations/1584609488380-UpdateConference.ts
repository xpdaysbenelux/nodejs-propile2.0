import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateConference1584609488380 implements MigrationInterface {
    name = 'UpdateConference1584609488380'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "conference" ADD CONSTRAINT "UQ_28a02b126a4e3a8ede47fc7efc3" UNIQUE ("name")`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "conference" DROP CONSTRAINT "UQ_28a02b126a4e3a8ede47fc7efc3"`, undefined);
    }

}
