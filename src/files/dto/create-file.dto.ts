import { IsOptional } from 'class-validator';
/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApartmentsType, Category } from '../entities/file.entity';

export class CreateFileDto {
    
    @IsNotEmpty({message : "The address field is empty "})    
    @IsString()    
    address : string;
   
    @IsNotEmpty({message : "The city field is empty "})    
    @IsString()    
    city : string

    @IsNotEmpty({message : "The country field is empty "})    
    @IsString()    
    country : string

    @IsNotEmpty({message : "The type field is empty "})    
    @IsString()    
    type : ApartmentsType

    @IsNotEmpty({message : "The amount field is empty "})    
    @IsString()    
    amount : string

    @IsNotEmpty({message : "The description field is empty "})    
    @IsString()    
    description : string

    @IsNotEmpty({message : "The category field is empty "})    
    @IsString()    
    category : Category

    @IsNotEmpty({message : "The floorspace field is empty "})    
    @IsString()    
    floorspace : string

    @IsNotEmpty({message : "The beds field is empty "})    
    @IsString()    
    beds : string

    @IsNotEmpty({message : "The baths field is empty "})    
    @IsString()    
    baths : string

    @IsNotEmpty({message : "The Furnishing field is empty "})    
    @IsString()    
    Furnishing : string

    @IsOptional()
    @IsNotEmpty({message : "The user field is empty "})    
    @IsString()    
    user?: string

    @IsOptional()        
    images?: []

    @IsOptional()          
    videos?: []
}

