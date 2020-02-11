import { BaseEntityResponse } from '../../_shared/dto';
import { UserState } from '../../_shared/constants';
import { PermissionsDto } from '../../roles/dto';

export class AuthenticationUserResponse extends BaseEntityResponse {
    readonly email: string;
    readonly state: UserState;
    readonly firstName?: string;
    readonly lastName?: string;
    readonly permissions: PermissionsDto;
}
