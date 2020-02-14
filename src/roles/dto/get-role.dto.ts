import { Type } from 'class-transformer';

import { BaseEntityResponse, PermissionsDto } from '../../_shared/dto';

export class RoleResponse extends BaseEntityResponse {
    readonly name: string;
    @Type(() => PermissionsDto)
    readonly permissions: PermissionsDto;

    readonly isDefault: boolean;
}
