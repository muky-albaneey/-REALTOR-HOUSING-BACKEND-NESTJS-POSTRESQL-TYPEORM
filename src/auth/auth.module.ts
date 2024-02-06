/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileBg } from './entities/profile-bg.entity';
import { ProfileImage } from './entities/profile-image.entity';
import { JwtService } from '@nestjs/jwt';


@Module({
imports : [TypeOrmModule.forFeature([ProfileBg, ProfileImage, User])],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
