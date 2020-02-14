import {MigrationInterface, QueryRunner} from "typeorm";

export class Sessions1581513612827 implements MigrationInterface {
    name = 'Sessions1581513612827'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "title" character varying NOT NULL, "subTitle" character varying, "xpFactor" integer, "description" text NOT NULL, "firstPresenterId" uuid, "secondPresenterId" uuid, CONSTRAINT "UQ_f013de4494182410cbe132ef9f5" UNIQUE ("title"), CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_8e6cf92eef1e63635b8c0ed133b" FOREIGN KEY ("firstPresenterId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_3ac6c7f2e88f04c516c60b76a97" FOREIGN KEY ("secondPresenterId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_3ac6c7f2e88f04c516c60b76a97"`, undefined);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_8e6cf92eef1e63635b8c0ed133b"`, undefined);
        await queryRunner.query(`DROP TABLE "session"`, undefined);
    }

}
