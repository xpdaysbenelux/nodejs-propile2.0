import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Conference } from './conference.entity';
import { Event } from './event.entity';

@Entity()
export class Room extends BaseEntity {
    @Column({ unique: true })
    name: string;

    @Column({ nullable: false })
    maxParticipants: number;

    @Column({ nullable: true, type: 'text' })
    location?: string;

    @ManyToOne(
        () => Conference,
        conference => conference.rooms,
    )
    conference: Conference;

    @OneToMany(
        () => Event,
        event => event.room,
        { cascade: ['remove'] },
    )
    events: Event[];
}
