import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateConferenceDeleteCascade1586961935494 implements MigrationInterface {
    name = 'UpdateConferenceDeleteCascade1586961935494'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "room" DROP CONSTRAINT "FK_ad71e694c910ebf5be1701a376e"`, undefined);
        await queryRunner.query(`ALTER TABLE "room" ADD CONSTRAINT "FK_ad71e694c910ebf5be1701a376e" FOREIGN KEY ("conferenceId") REFERENCES "conference"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "room" DROP CONSTRAINT "FK_ad71e694c910ebf5be1701a376e"`, undefined);
        await queryRunner.query(`ALTER TABLE "room" ADD CONSTRAINT "FK_ad71e694c910ebf5be1701a376e" FOREIGN KEY ("conferenceId") REFERENCES "conference"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
