import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Room } from './room.entity';
import { Program } from './program.entity';

@Entity()
export class Conference extends BaseEntity {
    @Column({ unique: true })
    name: string;

    @Column({ nullable: false })
    startDate: Date;

    @Column({ nullable: false })
    endDate: Date;

    @OneToMany(
        () => Program,
        program => program.conference,
    )
    programs: Program[];

    @OneToMany(
        () => Room,
        room => room.conference,
        { cascade: ['insert', 'update'] },
    )
    rooms: Room[];
}
