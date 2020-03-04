import { EntityRepository, Repository } from 'typeorm';

import { Persona } from '../entities';

@EntityRepository(Persona)
export class PersonaRepository extends Repository<Persona> {}
