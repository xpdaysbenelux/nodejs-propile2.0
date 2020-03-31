import { Injectable } from '@nestjs/common';
import { parseISO, isWithinInterval, isSameDay } from 'date-fns';

import { ProgramRepository, Program, ConferenceRepository } from '../database';
import { CreateProgramRequest } from './dto/create-program.dto';
import { IUserSession } from '../_shared/constants';
import {
    ProgramTitleAlreadyInUse,
    ProgramDateMustBeBetweenConferenceDates,
    StartEndTimeDatesMustBeSameAsProgramDate,
} from './errors';
import { ConferenceNotFoud } from '../conferences/errors';

@Injectable()
export class ProgramsService {
    constructor(
        private readonly programsRepository: ProgramRepository,
        private readonly conferenceRepository: ConferenceRepository,
    ) {}

    async createProgram(
        body: CreateProgramRequest,
        session: IUserSession,
    ): Promise<string> {
        const { title, date, startTime, endTime, conferenceId } = body;
        const programDate = parseISO(date);
        const programStartTime = parseISO(startTime);
        const programEndTime = parseISO(endTime);

        const program = new Program();

        const existingProgram = await this.programsRepository.findOne({
            title,
        });
        if (existingProgram) {
            throw new ProgramTitleAlreadyInUse();
        }
        program.title = title;

        const conference = await this.conferenceRepository.findOne({
            id: conferenceId,
        });
        if (!conference) {
            throw new ConferenceNotFoud();
        }
        program.conference = conference;

        // Check if the program date is one of or between the conference dates
        if (
            !isWithinInterval(programDate, {
                start: conference.startDate,
                end: conference.endDate,
            })
        ) {
            throw new ProgramDateMustBeBetweenConferenceDates();
        }
        program.date = programDate;

        // Check if the start & endTime dates are the same as the program date
        if (
            !isSameDay(programStartTime, programDate) ||
            !isSameDay(programEndTime, programDate)
        ) {
            throw new StartEndTimeDatesMustBeSameAsProgramDate();
        }
        program.startTime = programStartTime;
        program.endTime = programEndTime;

        program.createdBy = session.email;
        program.createdAt = new Date();

        await this.programsRepository.save(program);

        return program.id;
    }
}
