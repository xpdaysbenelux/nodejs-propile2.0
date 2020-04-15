import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateToDeleteCascadeWhereNeeded1586962521800 implements MigrationInterface {
    name = 'UpdateToDeleteCascadeWhereNeeded1586962521800'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "program" DROP CONSTRAINT "FK_1b10a2d7a42f16c842159a3f409"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_e2bd221f0e1dcb7bf8174b6ba59"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_7053aa43bf50d4f4463c9643999"`, undefined);
        await queryRunner.query(`ALTER TABLE "program" ADD CONSTRAINT "FK_1b10a2d7a42f16c842159a3f409" FOREIGN KEY ("conferenceId") REFERENCES "conference"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_e2bd221f0e1dcb7bf8174b6ba59" FOREIGN KEY ("programId") REFERENCES "program"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_7053aa43bf50d4f4463c9643999" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_7053aa43bf50d4f4463c9643999"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_e2bd221f0e1dcb7bf8174b6ba59"`, undefined);
        await queryRunner.query(`ALTER TABLE "program" DROP CONSTRAINT "FK_1b10a2d7a42f16c842159a3f409"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_7053aa43bf50d4f4463c9643999" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_e2bd221f0e1dcb7bf8174b6ba59" FOREIGN KEY ("programId") REFERENCES "program"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "program" ADD CONSTRAINT "FK_1b10a2d7a42f16c842159a3f409" FOREIGN KEY ("conferenceId") REFERENCES "conference"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
