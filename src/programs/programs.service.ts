import { Injectable } from '@nestjs/common';
import { parseISO, isWithinInterval, isSameDay } from 'date-fns';

import { ProgramRepository, Program, ConferenceRepository } from '../database';
import { CreateProgramRequest } from './dto/create-program.dto';
import { IUserSession } from '../_shared/constants';
import {
    ProgramTitleAlreadyInUse,
    ProgramDateMustBeBetweenConferenceDates,
    StartEndTimeDatesMustBeSameAsProgramDate,
    ProgramNotFoud,
} from './errors';
import { ConferenceNotFoud } from '../conferences/errors';
import { UpdateProgramRequest } from './dto';
import { Not } from 'typeorm';

@Injectable()
export class ProgramsService {
    constructor(
        private readonly programRepository: ProgramRepository,
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

        const existingProgram = await this.programRepository.findOne({
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

        await this.programRepository.save(program);

        return program.id;
    }

    async updateProgram(
        body: UpdateProgramRequest,
        programId: string,
        session: IUserSession,
    ): Promise<string> {
        const { title, date, startTime, endTime, conferenceId } = body;
        const programDate = parseISO(date);
        const programStartTime = parseISO(startTime);
        const programEndTime = parseISO(endTime);

        const existingProgram = await this.programRepository.findOne({
            where: { id: programId },
            relations: ['events'],
        });
        if (!existingProgram) {
            throw new ProgramNotFoud();
        }

        const existingProgramWithSameTitle = await this.programRepository.findOne(
            {
                where: { id: Not(programId), title },
            },
        );
        if (existingProgramWithSameTitle) {
            throw new ProgramTitleAlreadyInUse();
        }

        const conference = await this.conferenceRepository.findOne({
            id: conferenceId,
        });
        if (!conference) {
            throw new ConferenceNotFoud();
        }

        // Check if the program date is one of or between the conference dates
        if (
            !isWithinInterval(programDate, {
                start: conference.startDate,
                end: conference.endDate,
            })
        ) {
            throw new ProgramDateMustBeBetweenConferenceDates();
        }

        // Check if the start & endTime dates are the same as the program date
        if (
            !isSameDay(programStartTime, programDate) ||
            !isSameDay(programEndTime, programDate)
        ) {
            throw new StartEndTimeDatesMustBeSameAsProgramDate();
        }

        existingProgram.title = title;
        existingProgram.conference = conference;
        existingProgram.date = programDate;
        existingProgram.startTime = programStartTime;
        existingProgram.endTime = programEndTime;
        existingProgram.updatedBy = session.email;
        existingProgram.createdAt = new Date();

        await this.programRepository.save(existingProgram);

        return existingProgram.id;
    }

    async deleteProgram(programId: string): Promise<string> {
        const existingProgram = await this.programRepository.findOne({
            where: { id: programId },
            relations: ['events'],
        });
        if (!existingProgram) {
            throw new ProgramNotFoud();
        }

        await this.programRepository.delete(programId);
        return programId;
    }
}
