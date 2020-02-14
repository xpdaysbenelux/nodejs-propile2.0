import { IsString, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

import { PermissionsDto } from '../../_shared/dto';

export class CreateRoleRequest {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @Type(() => PermissionsDto)
    @ValidateNested()
    readonly permissions: PermissionsDto;
}
