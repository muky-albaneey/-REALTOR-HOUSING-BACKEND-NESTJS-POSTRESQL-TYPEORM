/* eslint-disable prettier/prettier */

import { OneToOne, JoinColumn, OneToMany, ManyToOne, Entity } from 'typeorm';
import { AbstractFileEntity } from "src/database/abstract.-file.entity";
import { File } from './file.entity';

@Entity()
export class Image extends AbstractFileEntity<Image> {
    
    // @ManyToOne(() => File, file => file.images)
    // @JoinColumn({ name: 'file_id' })
    // images?: File;

    @ManyToOne(() => File, file => file.images)
  @JoinColumn({ name: 'file_id' })
  file?: File;

}