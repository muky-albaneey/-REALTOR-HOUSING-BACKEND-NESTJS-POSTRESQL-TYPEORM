/* eslint-disable prettier/prettier */

import { JoinColumn, ManyToOne, Entity } from 'typeorm';
import { AbstractFileEntity } from "src/database/abstract.-file.entity";
import { File } from './file.entity';

@Entity()
export class Vid extends AbstractFileEntity<Vid> {
    @ManyToOne(() => File, file => file.videos)
    @JoinColumn({ name: 'vid_id' })
    file?: File;
}