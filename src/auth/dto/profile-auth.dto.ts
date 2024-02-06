/* eslint-disable prettier/prettier */

import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class ProfileAuthDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    name : string;


    @IsEmail()
    @IsString()
    @IsNotEmpty()
    base64 : string;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    content : string;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    ext : string;
}

