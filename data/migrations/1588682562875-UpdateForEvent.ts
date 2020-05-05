import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateForEvent1588682562875 implements MigrationInterface {
    name = 'UpdateForEvent1588682562875'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event" ADD "comment" text`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD "sessionId" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_e2bd221f0e1dcb7bf8174b6ba59"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "title"`, undefined);
        await queryRunner.query(`CREATE TYPE "event_title_enum" AS ENUM('BREAK', 'CLOSING', 'COFFEE_BREAK', 'CONFERENCE_DINNER', 'DINNER', 'DRINKS', 'EVENING_PROGRAMME', 'LUNCH', 'PLENARY', 'REGISTRATION', 'REGISTRATION_AND_COFFEE', 'WELCOME')`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD "title" "event_title_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "programId" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_e2bd221f0e1dcb7bf8174b6ba59" FOREIGN KEY ("programId") REFERENCES "program"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_095e9a5da8755583ff4b0fb621d" FOREIGN KEY ("sessionId") REFERENCES "session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_095e9a5da8755583ff4b0fb621d"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_e2bd221f0e1dcb7bf8174b6ba59"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "programId" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "title"`, undefined);
        await queryRunner.query(`DROP TYPE "event_title_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD "title" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_e2bd221f0e1dcb7bf8174b6ba59" FOREIGN KEY ("programId") REFERENCES "program"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "sessionId"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "comment"`, undefined);
    }

}
