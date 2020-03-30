import { Injectable } from '@nestjs/common';
import { parseISO, isWithinInterval, isSameDay } from 'date-fns';

import { ProgramRepository, Program } from '../database';
import { CreateProgramRequest } from './dto/create-program.dto';
import { IUserSession } from '../_shared/constants';
import {
    ProgramNameAlreadyInUse,
    ProgramDateMustBeBetweenConferenceDates,
    StartEndTimeDatesMustBeSameAsProgramDate,
} from './errors';

@Injectable()
export class ProgramsService {
    constructor(private readonly programsRepository: ProgramRepository) {}

    async createProgram(
        body: CreateProgramRequest,
        session: IUserSession,
    ): Promise<string> {
        const { title, date, startTime, endTime, conference } = body;
        const programDate = new Date(parseISO(date));
        const programStartTime = new Date(parseISO(startTime));
        const programEndTime = new Date(parseISO(endTime));

        const program = new Program();
        const existingProgram = await this.programsRepository.findOne({
            title,
        });
        if (existingProgram) {
            throw new ProgramNameAlreadyInUse();
        } else program.title = title;

        // Check if the program date is one of or between the conference dates
        if (
            !isWithinInterval(programDate, {
                start: parseISO(conference.startDate.toString()),
                end: parseISO(conference.endDate.toString()),
            })
        ) {
            throw new ProgramDateMustBeBetweenConferenceDates();
        } else program.date = programDate;

        // Check if the start & endTime dates are the same as the program date
        if (
            !isSameDay(programStartTime, programDate) ||
            !isSameDay(programEndTime, programDate)
        ) {
            throw new StartEndTimeDatesMustBeSameAsProgramDate();
        } else {
            program.startTime = new Date(startTime);
            program.endTime = new Date(endTime);
        }

        program.conference = conference;
        program.createdBy = session?.email;
        program.createdAt = new Date();

        await this.programsRepository.save(program);

        return program.id;
    }
}
