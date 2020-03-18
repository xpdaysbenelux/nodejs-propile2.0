import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Conference } from './conference.entity';

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

    @ManyToOne(() => Conference, { cascade: ['insert'] })
    conference: Conference;
}
