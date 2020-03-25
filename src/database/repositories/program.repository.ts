import { EntityRepository, Repository } from 'typeorm';

import { Program } from '../entities';

@EntityRepository(Program)
export class ProgramRepository extends Repository<Program> {}
