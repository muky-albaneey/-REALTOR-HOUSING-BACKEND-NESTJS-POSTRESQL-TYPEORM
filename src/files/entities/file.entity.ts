/* eslint-disable prettier/prettier */
import { User } from 'src/auth/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToOne,CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Image } from './image.entity';
import { Vid } from './vid.entity';
import { Cover } from './cover.entity';

export enum Category {
    RENT_OUT = "rent_out",
    SALE = "sale",    
    JOINT_VENTURE = "joint_venture",
    SHORT_LET = "short_let",
}

export enum ApartmentsType {
    FLAT_APARTMENT = "flat_apartment",
    HOUSE = "house",    
    LAND = "land",
    COMMERCIAL_PROPERTY = "commercial_property",
}

export enum AdvertLayer {
    LAYER_1 = "layer_1",
    LAYER_2 = "layer_2",    
    LAYER_3 = "layer_3",
    LAYER_4 = "layer_4",
}

@Entity()
export class File {
    
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ type: 'varchar', nullable: false })
  address: string;

  @Column({ type: 'varchar', nullable: false })
  city: string;

  @Column({ type: 'varchar', nullable: false })
  country: string;
  
  @Column({ type: 'enum', nullable: false,
  enum: ApartmentsType,
  default: ApartmentsType.FLAT_APARTMENT, })
  type: ApartmentsType;

  @Column({ type: 'varchar', nullable: false })
  amount: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'enum', nullable: false,
  enum: Category, default: Category.RENT_OUT })
  category: Category;

  @Column({ type: 'varchar', nullable: false })
  floorspace: string;

  @Column({ type: 'varchar', nullable: false })
  beds: string;

  @Column({ type: 'varchar', nullable: false })
  baths: string;

  @Column({ type: 'varchar', nullable: false })
  Furnishing : string;


  @ManyToOne(() => User, user => user.files)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @OneToMany(() => Image, image => image.file, { cascade: true })
  images?: Image[];

  @OneToMany(() => Vid, image => image.file, { cascade: true })
  videos?: Vid[];
   // Automatically set to the current timestamp when a new entity is created
   @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
   createdAt: Date;
 
   // Automatically set to the current timestamp when an entity is updated
   @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
   updatedAt: Date;

   @Column({ type: 'enum', nullable: false,
   enum: AdvertLayer,
   default:  AdvertLayer.LAYER_1})
   ads: AdvertLayer;

   @OneToOne(() => Image, image => image.file, { cascade: true })
   cover_image?: Cover;
   

  constructor(file: Partial<File>) {
    Object.assign(this, file);
}
}
