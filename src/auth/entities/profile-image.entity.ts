/* eslint-disable prettier/prettier */

import { OneToOne, JoinColumn, OneToMany, ManyToOne, Entity } from 'typeorm';
import { AbstractFileEntity } from '../../database/abstract.-file.entity';

@Entity()
export class ProfileImage extends AbstractFileEntity<ProfileImage> {
    
}