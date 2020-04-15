import { Entity, Column, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Program } from './program.entity';
import { Room } from './room.entity';

@Entity()
export class Event extends BaseEntity {
    @Column({ nullable: false })
    title: string;

    @Column({ default: false, nullable: false })
    spanRow: boolean;

    @Column({ nullable: false })
    startTime: Date;

    @Column({ nullable: false })
    endTime: Date;

    @ManyToOne(
        () => Program,
        program => program.events,
        { onDelete: 'CASCADE' },
    )
    program: Program;

    @ManyToOne(
        () => Room,
        room => room.events,
        { onDelete: 'CASCADE' },
    )
    room: Room;
}
