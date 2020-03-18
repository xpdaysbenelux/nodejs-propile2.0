import {MigrationInterface, QueryRunner} from "typeorm";

export class ProgramConferenceEventRoom1584543214173 implements MigrationInterface {
    name = 'ProgramConferenceEventRoom1584543214173'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "conference" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "name" character varying NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, CONSTRAINT "PK_e203a214f53b0eeefb3db00fdb2" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "program" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "title" character varying NOT NULL, "date" TIMESTAMP NOT NULL, "startTime" TIMESTAMP NOT NULL, "endTime" TIMESTAMP NOT NULL, "conferenceId" uuid, CONSTRAINT "UQ_e2856702273f6e3d6dc27299137" UNIQUE ("title"), CONSTRAINT "PK_3bade5945afbafefdd26a3a29fb" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "room" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "name" character varying NOT NULL, "maxParticipants" integer NOT NULL, "location" text, "conferenceId" uuid, CONSTRAINT "UQ_535c742a3606d2e3122f441b26c" UNIQUE ("name"), CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "title" character varying NOT NULL, "spanRow" boolean NOT NULL DEFAULT false, "startTime" TIMESTAMP NOT NULL, "endTime" TIMESTAMP NOT NULL, "programId" uuid, "roomId" uuid, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TYPE "public"."session_type_enum" RENAME TO "session_type_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "session_type_enum" AS ENUM('HANDS_ON', 'DISCOVERY', 'EXPERIENTIAL_LEARNING', 'SHORT_EXPERIENCE_REPORT', 'OTHER')`, undefined);
        await queryRunner.query(`ALTER TABLE "session" ALTER COLUMN "type" TYPE "session_type_enum" USING "type"::"text"::"session_type_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "session_type_enum_old"`, undefined);
        await queryRunner.query(`ALTER TABLE "program" ADD CONSTRAINT "FK_1b10a2d7a42f16c842159a3f409" FOREIGN KEY ("conferenceId") REFERENCES "conference"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "room" ADD CONSTRAINT "FK_ad71e694c910ebf5be1701a376e" FOREIGN KEY ("conferenceId") REFERENCES "conference"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_e2bd221f0e1dcb7bf8174b6ba59" FOREIGN KEY ("programId") REFERENCES "program"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_7053aa43bf50d4f4463c9643999" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_7053aa43bf50d4f4463c9643999"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_e2bd221f0e1dcb7bf8174b6ba59"`, undefined);
        await queryRunner.query(`ALTER TABLE "room" DROP CONSTRAINT "FK_ad71e694c910ebf5be1701a376e"`, undefined);
        await queryRunner.query(`ALTER TABLE "program" DROP CONSTRAINT "FK_1b10a2d7a42f16c842159a3f409"`, undefined);
        await queryRunner.query(`CREATE TYPE "session_type_enum_old" AS ENUM('HANDS_ON', 'DISCOVERY', 'EXPERIENTAL_LEARNING', 'OTHER')`, undefined);
        await queryRunner.query(`ALTER TABLE "session" ALTER COLUMN "type" TYPE "session_type_enum_old" USING "type"::"text"::"session_type_enum_old"`, undefined);
        await queryRunner.query(`DROP TYPE "session_type_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "session_type_enum_old" RENAME TO  "session_type_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "event"`, undefined);
        await queryRunner.query(`DROP TABLE "room"`, undefined);
        await queryRunner.query(`DROP TABLE "program"`, undefined);
        await queryRunner.query(`DROP TABLE "conference"`, undefined);
    }

}
