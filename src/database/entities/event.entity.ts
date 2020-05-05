import { Entity, Column, ManyToOne } from 'typeorm';

import { EventTitle } from '../../events/constants';
import { BaseEntity } from './base.entity';
import { Program } from './program.entity';
import { Session } from './session.entity';
import { Room } from './room.entity';

@Entity()
export class Event extends BaseEntity {
    @Column({ default: false, nullable: false })
    spanRow: boolean;

    @Column({ nullable: true, enum: EventTitle, type: 'enum' })
    title: EventTitle;

    @Column({ type: 'text', nullable: true })
    comment: string;

    @Column({ nullable: false })
    startTime: Date;

    @Column({ nullable: false })
    endTime: Date;

    @ManyToOne(
        () => Program,
        program => program.events,
        { onDelete: 'CASCADE', nullable: false },
    )
    program: Program;

    @ManyToOne(
        () => Room,
        room => room.events,
        { onDelete: 'CASCADE', nullable: true },
    )
    room: Room;

    @ManyToOne(
        () => Session,
        session => session.events,
        { nullable: true },
    )
    session: Session;
}
