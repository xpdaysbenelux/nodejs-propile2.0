import { Entity, Column, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Session extends BaseEntity {
    @Column({ unique: true })
    title: string;

    @Column({ nullable: true })
    subTitle?: string;

    @ManyToOne(() => User, { cascade: ['insert'] })
    firstPresenter: User;

    @ManyToOne(() => User, { cascade: ['insert'] })
    secondPresenter?: User;

    @Column({ nullable: true })
    xpFactor?: number;

    @Column({ type: 'text' })
    description: string;
}
