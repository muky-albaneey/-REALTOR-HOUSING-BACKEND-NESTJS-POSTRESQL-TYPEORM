/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Image } from './entities/image.entity';
import { Vid } from './entities/vid.entity';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/auth/entities/user.entity';
import { Cover } from './entities/cover.entity';

@Module({
  imports : [TypeOrmModule.forFeature([File, Image, Vid, Cover, User])],
  controllers: [FilesController],
  providers: [FilesService, JwtService],
})
export class FilesModule {}
