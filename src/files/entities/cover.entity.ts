/* eslint-disable prettier/prettier */

import { OneToOne, JoinColumn, OneToMany, ManyToOne, Entity } from 'typeorm';
import { AbstractFileEntity } from '../../database/abstract.-file.entity';
import { File } from './file.entity';

@Entity()
export class Cover extends AbstractFileEntity<Cover> {
    
    @OneToOne(() => File, file => file.cover_image)
    @JoinColumn({ name: 'file_id' })
    file?: File;
}