import { Entity, Column, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Conference } from './conference.entity';

@Entity()
export class Room extends BaseEntity {
    @Column({ unique: true })
    name: string;

    @Column({ nullable: false })
    maxParticipants: number;

    @Column({ nullable: true, type: 'text' })
    location?: string;

    @ManyToOne(() => Conference, { cascade: ['insert'] })
    conference: Conference;
}
