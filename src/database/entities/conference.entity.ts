import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class Conference extends BaseEntity {
    @Column({ unique: false })
    name: string;

    @Column({ nullable: false })
    startDate: Date;

    @Column({ nullable: false })
    endDate: Date;
}
