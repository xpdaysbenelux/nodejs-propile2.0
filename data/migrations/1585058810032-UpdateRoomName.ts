import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateRoomName1585058810032 implements MigrationInterface {
    name = 'UpdateRoomName1585058810032'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "room" DROP CONSTRAINT "UQ_535c742a3606d2e3122f441b26c"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "room" ADD CONSTRAINT "UQ_535c742a3606d2e3122f441b26c" UNIQUE ("name")`, undefined);
    }

}
