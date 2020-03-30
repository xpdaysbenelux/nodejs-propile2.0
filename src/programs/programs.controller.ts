import { Body, UseGuards, Controller, Post, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ProgramsService } from './programs.service';
import { ProgramQueries } from './programs.queries';
import { CreateProgramRequest } from './dto/create-program.dto';
import { UserSession, RequiredPermissions } from '../_shared/decorators';
import { IUserSession } from '../_shared/constants';
import {
    AuthenticatedGuard,
    RequiredPermissionsGuard,
} from '../_shared/guards';
import { ProgramResponse, ProgramIdParam } from './dto/get-program.dto';

@UseGuards(AuthenticatedGuard)
@Controller('programs')
@ApiTags('programs')
export class ProgramController {
    constructor(
        private readonly programService: ProgramsService,
        private readonly programQueries: ProgramQueries,
    ) {}

    @RequiredPermissions({ programs: { view: true, edit: true } })
    @UseGuards(RequiredPermissionsGuard)
    @Get(':programId')
    getConference(@Param() params: ProgramIdParam): Promise<ProgramResponse> {
        return this.programQueries.getProgram(params.programId);
    }

    @RequiredPermissions({ programs: { edit: true } })
    @UseGuards(RequiredPermissionsGuard)
    @Post()
    async createProgram(
        @Body() body: CreateProgramRequest,
        @UserSession() session: IUserSession,
    ): Promise<ProgramResponse> {
        const programId = await this.programService.createProgram(
            body,
            session,
        );
        return this.programQueries.getProgram(programId);
    }
}
