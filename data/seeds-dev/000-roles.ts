import { MigrationInterface, QueryRunner } from 'typeorm';
import { readFileSync } from 'fs';

import { loadFixtures, deleteFixtures } from './util/run-seeds';

const entityName = 'Role';
const path = `${__dirname}/roles.json`;
const data = JSON.parse(readFileSync(path).toString());

export class RolesSeeds1578312827195 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await loadFixtures(queryRunner.manager, data, entityName);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await deleteFixtures(queryRunner.manager, data, entityName);
    }
}
