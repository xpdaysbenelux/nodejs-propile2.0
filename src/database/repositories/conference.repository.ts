import { EntityRepository, Repository } from 'typeorm';

import { Conference } from '../entities';

@EntityRepository(Conference)
export class ConferenceRepository extends Repository<Conference> {}
