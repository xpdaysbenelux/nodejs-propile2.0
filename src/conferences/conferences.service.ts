import { Injectable } from '@nestjs/common';
import { parseISO } from 'date-fns';

import { ConferenceRepository, Conference, Room } from '../database';
import { CreateConferenceRequest, RoomRequest } from './dto';
import { IUserSession } from '../_shared/constants';
import {
    ConferenceNameAlreadyInUse,
    ConferenceMustHaveAtLeastTwoRooms,
} from './errors';

@Injectable()
export class ConferencesService {
    constructor(private readonly conferenceRepository: ConferenceRepository) {}

    async createConference(
        body: CreateConferenceRequest,
        session: IUserSession,
    ): Promise<string> {
        const { name, startDate, endDate, rooms } = body;

        // Check for unique name
        const existingConference = await this.conferenceRepository.findOne({
            name,
        });
        if (existingConference) {
            throw new ConferenceNameAlreadyInUse();
        }

        const conference = new Conference();
        conference.name = name;
        conference.startDate = new Date(parseISO(startDate));
        conference.endDate = new Date(parseISO(endDate));
        conference.createdBy = session.email;
        conference.createdAt = new Date();
        conference.rooms = this.makeConferenceRooms(rooms);

        await this.conferenceRepository.save(conference);

        return conference.id;
    }

    private makeConferenceRooms(givenRooms: RoomRequest[]): Room[] {
        if (givenRooms.length < 2) {
            throw new ConferenceMustHaveAtLeastTwoRooms();
        }

        const rooms: Room[] = [];
        givenRooms.forEach(room => {
            const newRoom = new Room();
            newRoom.name = room.name;
            newRoom.maxParticipants = room.maxParticipants;
            newRoom.location = room.location || null;

            rooms.push(newRoom);
        });
        return rooms;
    }
}
