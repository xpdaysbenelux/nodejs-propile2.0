import { IsBoolean, IsOptional } from 'class-validator';

class RolePermissionsDto {
    @IsBoolean()
    @IsOptional()
    readonly view?: boolean;

    @IsBoolean()
    @IsOptional()
    readonly edit?: boolean;
}

class UserPermissionsDto {
    @IsBoolean()
    @IsOptional()
    readonly view?: boolean;

    @IsBoolean()
    @IsOptional()
    readonly edit?: boolean;
}

class SessionPermissionsDto {
    @IsBoolean()
    @IsOptional()
    readonly view?: boolean;

    @IsBoolean()
    @IsOptional()
    readonly edit?: boolean;

    @IsBoolean()
    @IsOptional()
    readonly admin?: boolean;
}

class ConferencePermissionsDTo {
    @IsBoolean()
    @IsOptional()
    readonly view?: boolean;

    @IsBoolean()
    @IsOptional()
    readonly edit?: boolean;
}

class ProgramPermissionsDTO {
    @IsBoolean()
    @IsOptional()
    readonly view?: boolean;

    @IsBoolean()
    @IsOptional()
    readonly edit?: boolean;
}

class PersonaPermissionsDto {
    @IsBoolean()
    @IsOptional()
    readonly view?: boolean;

    @IsBoolean()
    @IsOptional()
    readonly edit?: boolean;
}

export class PermissionsDto {
    @IsOptional()
    readonly roles?: RolePermissionsDto;

    @IsOptional()
    readonly users?: UserPermissionsDto;

    @IsOptional()
    readonly sessions?: SessionPermissionsDto;

    @IsOptional()
    readonly conferences?: ConferencePermissionsDTo;

    @IsOptional()
    readonly programs?: ProgramPermissionsDTO;

    @IsOptional()
    readonly personas?: PersonaPermissionsDto;
}
