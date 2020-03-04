import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';

import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Persona } from './persona.entity';
import {
    SessionState,
    SessionType,
    SessionTopic,
    SessionDuration,
    SessionExpierenceLevel,
} from '../../sessions/constants';
@Entity()
export class Session extends BaseEntity {
    @Column({ unique: true })
    title: string;

    @Column({ nullable: true })
    subTitle?: string;

    @ManyToOne(() => User, { cascade: ['insert'] })
    firstPresenter: User;

    @ManyToOne(() => User, { cascade: ['insert'] })
    secondPresenter?: User;

    @Column({ nullable: true })
    xpFactor?: number;

    @Column({ type: 'text' })
    description: string;

    @Column({ enum: SessionState, default: SessionState.Draft, type: 'enum' })
    sessionState?: SessionState;

    @Column({ nullable: true, type: 'text' })
    shortDescription?: string;

    @Column({ nullable: true, type: 'text' })
    goal?: string;

    @Column({ nullable: true, enum: SessionType, type: 'enum' })
    type?: SessionType;

    @Column({ nullable: true, enum: SessionTopic, type: 'enum' })
    topic?: SessionTopic;

    @Column({ nullable: true, default: 50 })
    maxParticipants?: number;

    @Column({ nullable: true, enum: SessionDuration, type: 'enum' })
    duration?: SessionDuration;

    @Column({ default: false })
    laptopsRequired?: boolean;

    @Column({ nullable: true, type: 'text' })
    otherLimitations?: string;

    @ManyToMany(() => Persona)
    @JoinTable()
    intendedAudience?: Persona[];

    @Column({ nullable: true, type: 'text' })
    roomSetup?: string;

    @Column({ nullable: true, type: 'text' })
    neededMaterials?: string;

    @Column({
        enum: SessionExpierenceLevel,
        default: SessionExpierenceLevel.Novice,
        type: 'enum',
    })
    expierenceLevel: SessionExpierenceLevel;

    @Column({ nullable: true, type: 'text' })
    outline?: string;

    @Column({ nullable: true, type: 'text' })
    materialDescription?: string;

    @Column({ nullable: true, type: 'text' })
    materialUrl?: string;
}
