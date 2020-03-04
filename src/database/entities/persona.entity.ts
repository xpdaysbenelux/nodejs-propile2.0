import { Entity, Column, ManyToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Session } from './session.entity';

@Entity()
export class Persona extends BaseEntity {
    @Column({ unique: true })
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column()
    imageUrl: string;
}
