import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Conference } from './conference.entity';
import { Event } from './event.entity';

@Entity()
export class Program extends BaseEntity {
    @Column({ unique: true })
    title: string;

    @Column({ nullable: false })
    date: Date;

    @Column({ nullable: false })
    startTime: Date;

    @Column({ nullable: false })
    endTime: Date;

    @ManyToOne(() => Conference)
    conference: Conference;

    @OneToMany(
        () => Event,
        event => event.program,
        { cascade: ['remove'] },
    )
    events: Event[];
}
