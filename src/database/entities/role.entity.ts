import { Entity, Column } from 'typeorm';

import { BaseEntity } from './base.entity';

export class Permissions {
    roles: RolePermissions;
    users: UserPermissions;
    sessions: SessionPermissions;
    personas: PersonaPermissions;
}

class RolePermissions {
    view: boolean;
    edit: boolean;
}

class UserPermissions {
    view: boolean;
    edit: boolean;
}

class SessionPermissions {
    view: boolean;
    edit: boolean;
    admin: boolean;
}

class PersonaPermissions {
    view: boolean;
    edit: boolean;
}

@Entity()
export class Role extends BaseEntity {
    @Column({ unique: true })
    name: string;

    /**
     * Keep the permissions as a json file
     */
    @Column({ type: 'json' })
    permissions: Permissions;

    @Column({ default: false })
    isDefault: boolean;
}
