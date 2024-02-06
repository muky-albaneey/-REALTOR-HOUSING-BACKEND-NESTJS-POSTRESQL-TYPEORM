/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { IsString, IsEmail, IsOptional, Matches, MinLength, MaxLength, IsNotEmpty, IsMimeType } from 'class-validator';
import { ProfileAuthDto } from './profile-auth.dto';
// export class UpdateAuthDto extends PartialType(CreateAuthDto) {}
export class UpdateAuthDto {

    @IsOptional()
    @IsString()
    name?: string;


    @IsOptional()
    @IsEmail()
    @IsString()     
    email?: string;
    

    @IsOptional()
    @MaxLength(5, {message : "The password should not exceed 5"})
    @MinLength(7, {message : "The password should exceed 7"})
    @IsString()
    password?: string;
    
    @IsOptional()
    @Matches(/^\+?[1-9][0-9]{7,14}$/, {message : "Please provide a valid phone number"})    
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    gender?: string;

    @IsOptional()
    @IsString()
    profile_bg?: ProfileAuthDto;

    
    @IsOptional()
    @IsString()
    profile_image?: ProfileAuthDto;
    
}

export class UploadProfileDto {
    @IsNotEmpty()
    @IsString()
    // @Matches(/^data:image\/(jpeg|png|gif|jpg|avif);base64,/, { message: 'Invalid image data URI format' })
    @IsMimeType({ each: true, message: 'Invalid image file format for profile image' })
    avatar: Express.Multer.File; // This will store the base64-encoded image
  }