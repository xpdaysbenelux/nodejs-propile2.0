import {
    Body,
    UseGuards,
    Controller,
    Post,
    Get,
    Param,
    Query,
    Put,
    Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ProgramsService } from './programs.service';
import { ProgramsQueries } from './programs.queries';
import { CreateProgramRequest } from './dto/create-program.dto';
import { UserSession, RequiredPermissions } from '../_shared/decorators';
import { IUserSession } from '../_shared/constants';
import {
    AuthenticatedGuard,
    RequiredPermissionsGuard,
} from '../_shared/guards';
import { ProgramResponse, ProgramIdParam } from './dto/get-program.dto';
import {
    GetProgramsRequestQuery,
    GetProgramsResponse,
} from './dto/get-programs.dto';
import { UpdateProgramRequest } from './dto';

@UseGuards(AuthenticatedGuard)
@Controller('programs')
@ApiTags('programs')
export class ProgramController {
    constructor(
        private readonly programsService: ProgramsService,
        private readonly programsQueries: ProgramsQueries,
    ) {}

    @RequiredPermissions({ programs: { view: true, edit: true } })
    @UseGuards(RequiredPermissionsGuard)
    @Get(':programId')
    getProgram(@Param() params: ProgramIdParam): Promise<ProgramResponse> {
        return this.programsQueries.getProgram(params.programId);
    }

    @RequiredPermissions({ programs: { view: true, edit: true } })
    @UseGuards(RequiredPermissionsGuard)
    @Get()
    getPrograms(
        @Query() query: GetProgramsRequestQuery,
    ): Promise<GetProgramsResponse> {
        return this.programsQueries.getPrograms(query);
    }

    @RequiredPermissions({ programs: { edit: true } })
    @UseGuards(RequiredPermissionsGuard)
    @Post()
    async createProgram(
        @Body() body: CreateProgramRequest,
        @UserSession() session: IUserSession,
    ): Promise<ProgramResponse> {
        const programId = await this.programsService.createProgram(
            body,
            session,
        );
        return this.programsQueries.getProgram(programId);
    }

    @RequiredPermissions({ programs: { edit: true } })
    @UseGuards(RequiredPermissionsGuard)
    @Put(':programId')
    async updateProgram(
        @Body() body: UpdateProgramRequest,
        @Param() params: ProgramIdParam,
        @UserSession() userSession: IUserSession,
    ): Promise<ProgramResponse> {
        const programId = await this.programsService.updateProgram(
            body,
            params.programId,
            userSession,
        );
        return this.programsQueries.getProgram(programId);
    }

    @RequiredPermissions({ programs: { edit: true } })
    @UseGuards(RequiredPermissionsGuard)
    @Delete(':programId')
    async deleteProgram(@Param() params: ProgramIdParam): Promise<string> {
        const programId = await this.programsService.deleteProgram(
            params.programId,
        );
        return programId;
    }
}
