import { Injectable } from '@nestjs/common';

import { ProgramRepository } from '../database';
import { ProgramResponse } from './dto/get-program.dto';

const programFields = [
    'profram.id',
    'program.title',
    'program.date',
    'program.startTime',
    'program.endTime',
    'conference.id',
    'conference.name',
    'event.id',
    'event.spanRow',
    'event.startTime',
    'event.endTime',
    'event.room',
];

@Injectable()
export class ProgramQueries {
    constructor(private readonly programRepository: ProgramRepository) {}

    async getProgram(programId: string): Promise<ProgramResponse> {
        return this.programRepository
            .createQueryBuilder('program')
            .select(programFields)
            .where('program.id = :programId', { programId })
            .innerJoin('program.conference', 'conference')
            .leftJoin('program.events', 'event')
            .getOne();
    }
}
