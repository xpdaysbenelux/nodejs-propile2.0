import {MigrationInterface, QueryRunner} from "typeorm";

export class Personas1582116932576 implements MigrationInterface {
    name = 'Personas1582116932576'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "persona" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "name" character varying NOT NULL, "description" text NOT NULL, "imageUrl" character varying NOT NULL, CONSTRAINT "UQ_6c69388f15f82c32d91cba393b2" UNIQUE ("name"), CONSTRAINT "PK_13aefc75f60510f2be4cd243d71" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "session_intended_audience_persona" ("sessionId" uuid NOT NULL, "personaId" uuid NOT NULL, CONSTRAINT "PK_95ae4092dc10fe1449c7f59d99d" PRIMARY KEY ("sessionId", "personaId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_19d8caaa2ab0a0cfad2f46564c" ON "session_intended_audience_persona" ("sessionId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_a98d6c1aa52f4e0e1003cc0ca9" ON "session_intended_audience_persona" ("personaId") `, undefined);
        await queryRunner.query(`CREATE TYPE "session_sessionstate_enum" AS ENUM('DRAFT', 'CANCELED', 'CONFIRMED')`, undefined);
        await queryRunner.query(`ALTER TABLE "session" ADD "sessionState" "session_sessionstate_enum" NOT NULL DEFAULT 'DRAFT'`, undefined);
        await queryRunner.query(`ALTER TABLE "session" ADD "shortDescription" text`, undefined);
        await queryRunner.query(`ALTER TABLE "session" ADD "goal" text`, undefined);
        await queryRunner.query(`CREATE TYPE "session_type_enum" AS ENUM('HANDS_ON', 'DISCOVERY', 'EXPERIENTAL_LEARNING', 'OTHER')`, undefined);
        await queryRunner.query(`ALTER TABLE "session" ADD "type" "session_type_enum"`, undefined);
        await queryRunner.query(`CREATE TYPE "session_topic_enum" AS ENUM('TECHNOLOGY_AND_TECHNIQUE', 'TEAM_AND_INDIVIDUAL', 'PROCESS_AND_IMPROVEMENT', 'CUSTOMER_AND_PLANNING', 'CASES_AND_INTROS')`, undefined);
        await queryRunner.query(`ALTER TABLE "session" ADD "topic" "session_topic_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "session" ADD "maxParticipants" integer DEFAULT 50`, undefined);
        await queryRunner.query(`CREATE TYPE "session_duration_enum" AS ENUM('30', '60', '90', '150')`, undefined);
        await queryRunner.query(`ALTER TABLE "session" ADD "duration" "session_duration_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "session" ADD "laptopsRequired" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "session" ADD "otherLimitations" text`, undefined);
        await queryRunner.query(`ALTER TABLE "session" ADD "roomSetup" text`, undefined);
        await queryRunner.query(`ALTER TABLE "session" ADD "neededMaterials" text`, undefined);
        await queryRunner.query(`CREATE TYPE "session_expierencelevel_enum" AS ENUM('NOVICE', 'MEDIUM', 'EXPERT')`, undefined);
        await queryRunner.query(`ALTER TABLE "session" ADD "expierenceLevel" "session_expierencelevel_enum" NOT NULL DEFAULT 'NOVICE'`, undefined);
        await queryRunner.query(`ALTER TABLE "session" ADD "outline" text`, undefined);
        await queryRunner.query(`ALTER TABLE "session" ADD "materialDescription" text`, undefined);
        await queryRunner.query(`ALTER TABLE "session" ADD "materialUrl" text`, undefined);
        await queryRunner.query(`ALTER TABLE "session_intended_audience_persona" ADD CONSTRAINT "FK_19d8caaa2ab0a0cfad2f46564c9" FOREIGN KEY ("sessionId") REFERENCES "session"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "session_intended_audience_persona" ADD CONSTRAINT "FK_a98d6c1aa52f4e0e1003cc0ca9e" FOREIGN KEY ("personaId") REFERENCES "persona"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "session_intended_audience_persona" DROP CONSTRAINT "FK_a98d6c1aa52f4e0e1003cc0ca9e"`, undefined);
        await queryRunner.query(`ALTER TABLE "session_intended_audience_persona" DROP CONSTRAINT "FK_19d8caaa2ab0a0cfad2f46564c9"`, undefined);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "materialUrl"`, undefined);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "materialDescription"`, undefined);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "outline"`, undefined);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "expierenceLevel"`, undefined);
        await queryRunner.query(`DROP TYPE "session_expierencelevel_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "neededMaterials"`, undefined);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "roomSetup"`, undefined);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "otherLimitations"`, undefined);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "laptopsRequired"`, undefined);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "duration"`, undefined);
        await queryRunner.query(`DROP TYPE "session_duration_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "maxParticipants"`, undefined);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "topic"`, undefined);
        await queryRunner.query(`DROP TYPE "session_topic_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "type"`, undefined);
        await queryRunner.query(`DROP TYPE "session_type_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "goal"`, undefined);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "shortDescription"`, undefined);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "sessionState"`, undefined);
        await queryRunner.query(`DROP TYPE "session_sessionstate_enum"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_a98d6c1aa52f4e0e1003cc0ca9"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_19d8caaa2ab0a0cfad2f46564c"`, undefined);
        await queryRunner.query(`DROP TABLE "session_intended_audience_persona"`, undefined);
        await queryRunner.query(`DROP TABLE "persona"`, undefined);
    }

}
