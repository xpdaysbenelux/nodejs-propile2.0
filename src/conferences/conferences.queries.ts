import { Injectable } from '@nestjs/common';
import { ConferenceRepository } from 'src/database';
import { ConferenceResponse } from './dto';

const conferenceFields = [
    'conference.id',
    'conference.name',
    'conference.startDate',
    'conference.endDate',
    'rooms.id',
    'rooms.name',
    'rooms.maxParticipants',
];

@Injectable()
export class ConferencesQueries {
    constructor(private readonly conferenceRepository: ConferenceRepository) {}

    async getConference(conferenceId: string): Promise<ConferenceResponse> {
        return this.conferenceRepository
            .createQueryBuilder('conference')
            .select(conferenceFields)
            .where('conference.id = :conferenceId', { conferenceId })
            .innerJoin('conference.rooms', 'rooms')
            .getOne();
    }
}
