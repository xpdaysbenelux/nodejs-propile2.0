import { Injectable } from '@nestjs/common';
import { parseISO } from 'date-fns';
import { Not, Connection } from 'typeorm';

import { ConferenceRepository, Conference, Room } from '../database';
import {
    CreateConferenceRequest,
    RoomRequest,
    UpdateConferenceRequest,
} from './dto';
import { IUserSession } from '../_shared/constants';
import {
    ConferenceNameAlreadyInUse,
    ConferenceMustHaveAtLeastTwoRooms,
    ConferenceNotFoud,
} from './errors';
import { RoomsService } from '../rooms/rooms.service';

@Injectable()
export class ConferencesService {
    constructor(
        private readonly conferenceRepository: ConferenceRepository,
        //private readonly roomsService: RoomsService,
        private connection: Connection,
    ) {}

    async createConference(
        body: CreateConferenceRequest,
        user: IUserSession,
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
        conference.startDate = parseISO(startDate);
        conference.endDate = parseISO(endDate);
        conference.createdBy = user.email;
        conference.createdAt = new Date();
        conference.rooms = this.makeConferenceRooms(rooms);

        await this.conferenceRepository.save(conference);

        return conference.id;
    }

    async updateConference(
        body: UpdateConferenceRequest,
        conferenceId: string,
        user: IUserSession,
    ): Promise<string> {
        const { name, startDate, endDate, rooms } = body;

        const existingConference = await this.conferenceRepository.findOne({
            where: { id: conferenceId },
            relations: ['rooms'],
        });
        if (!existingConference) {
            throw new ConferenceNotFoud();
        }

        const existingConferenceWithSameName = await this.conferenceRepository.findOne(
            {
                where: {
                    id: Not(conferenceId),
                    name,
                },
            },
        );
        if (existingConferenceWithSameName) {
            throw new ConferenceNameAlreadyInUse();
        }

        existingConference.name = name;
        existingConference.startDate = parseISO(startDate);
        existingConference.endDate = parseISO(endDate);
        existingConference.updatedBy = user.email;
        existingConference.updatedAt = new Date();
        existingConference.rooms = this.makeConferenceRooms(rooms);

        await this.connection.transaction(async manager => {
            await this.conferenceRepository.save(existingConference);
            // await this.roomsService.deleteRoomsFromConference(conferenceId);
        });

        return existingConference.id;
    }

    async deleteConference(conferenceId: string): Promise<string> {
        const existingConference = await this.conferenceRepository.findOne({
            where: { id: conferenceId },
            relations: ['rooms'],
        });
        if (!existingConference) {
            throw new ConferenceNotFoud();
        }

        await this.conferenceRepository.delete(conferenceId);
        return conferenceId;
    }

    private makeConferenceRooms(givenRooms: RoomRequest[]): Room[] {
        if (givenRooms.length < 2) {
            throw new ConferenceMustHaveAtLeastTwoRooms();
        }

        return givenRooms.map(room => {
            const newRoom = new Room();

            if (room.id) {
                newRoom.id = room.id;
            }
            newRoom.name = room.name;
            newRoom.maxParticipants = room.maxParticipants;
            newRoom.location = room.location || null;

            return newRoom;
        });
    }
}
