import { Body, UseGuards, Controller, Post } from '@nestjs/common';
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

@UseGuards(AuthenticatedGuard)
@Controller('programs')
@ApiTags('programs')
export class ProgramController {
    constructor(
        private readonly programService: ProgramsService,
        private readonly programQueries: ProgramQueries,
    ) {}

    @RequiredPermissions({ programs: { edit: true } })
    @UseGuards(RequiredPermissionsGuard)
    @Post()
    async createProgram(
        @Body() body: CreateProgramRequest,
        @UserSession() session: IUserSession,
    ): Promise<string> {
        const programId = await this.programService.createProgram(
            body,
            session,
        );

        return programId;
    }
}
