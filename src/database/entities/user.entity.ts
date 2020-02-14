import { Entity, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { UserState } from '../../_shared/constants';
import { Role } from './role.entity';
import { Session } from './session.entity';

@Entity()
export class User extends BaseEntity {
    @Column({ unique: true })
    email: string;

    /**
     * Defaults to REGISTERING when not given.
     */
    @Column({ enum: UserState, default: UserState.Registering, type: 'enum' })
    state: UserState;

    @Column({ nullable: true })
    firstName?: string;

    @Column({ nullable: true })
    lastName?: string;

    @Column({ nullable: true })
    password?: string;

    @Column({ nullable: true })
    resetToken?: string;

    @ManyToMany(() => Role)
    @JoinTable()
    roles: Role[];

    @OneToMany(
        () => Session,
        session => session.secondPresenter,
    )
    sessions: Session[];
}
