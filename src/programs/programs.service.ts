import { Injectable } from '@nestjs/common';
import { ProgramRepository, Program } from 'src/database';
import { CreateProgramRequest } from './dto/create-program.dto';
import { IUserSession } from 'src/_shared/constants';
import {
    ProgramNameAlreadyInUse,
    ProgramDateMustBeBetweenConferenceDates,
} from './errors';

@Injectable()
export class ProgramsService {
    constructor(private readonly programsRepository: ProgramRepository) {}

    async createProgram(
        body: CreateProgramRequest,
        session: IUserSession,
    ): Promise<string> {
        const { title, date, startTime, endTime, conference } = body;
        const programDate = new Date(date);

        const existingProgram = await this.programsRepository.findOne({
            title,
        });
        if (existingProgram) {
            throw new ProgramNameAlreadyInUse();
        }

        const program = new Program();
        program.title = title;

        if (
            programDate < new Date(conference.startDate) ||
            programDate > new Date(conference.endDate)
        ) {
            throw new ProgramDateMustBeBetweenConferenceDates();
        }

        program.startTime = new Date(startTime);
        program.endTime = new Date(endTime);
        program.conference = conference;

        await this.programsRepository.save(program);

        return program.id;
    }
}
