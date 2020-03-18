import { Entity, BaseEntity, Column } from 'typeorm';

@Entity()
export class Conference extends BaseEntity {
    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    startDate: Date;

    @Column({ nullable: true })
    endDate: Date;
}
