import { EntityRepository, Repository } from 'typeorm';

import { Room } from '../entities';

@EntityRepository(Room)
export class RoomRepository extends Repository<Room> {}
