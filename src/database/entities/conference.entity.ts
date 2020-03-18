import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class Conference extends BaseEntity {
    @Column({ unique: false })
    name: string;

    @Column({ nullable: true })
    startDate: Date;

    @Column({ nullable: true })
    endDate: Date;
}
