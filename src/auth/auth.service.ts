/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { ProfileBg } from './entities/profile-bg.entity';
import { ProfileImage } from './entities/profile-image.entity';
import * as path from 'path';
// import * as bcrypt from 'bcrypt'


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ProfileBg)
    private readonly ProfileBgRepository: Repository<ProfileBg>,
    @InjectRepository(ProfileImage)
    private readonly ProfileImageBgRepository: Repository<ProfileImage>,
    private readonly jwt: JwtService,
    private readonly configService: ConfigService
    // private readonly email: EmailService,
) {}


  async create(createAuthDto: CreateAuthDto): Promise<any>{
    try {
      // Check if the user already exists
      
      const userValidate = await this.userRepository.findOne({
        where: { email: createAuthDto.email },
      });

      if (userValidate) {
        throw new UnauthorizedException('The user already exists!');
      }

      // Create and save the new user
      const newUser = await this.userRepository.create(createAuthDto);
      const userSaved = await this.userRepository.save(newUser);

      // Create token payload with necessary information (excluding sensitive data)
      
      return { user: userSaved };
      
    } catch (error) {
      // Handle errors, log or rethrow as needed
      console.error('User creation failed', error);
      throw error;
    }
    // return 'This action adds a new auth';
  }
  async login(createAuthDto: CreateAuthDto): Promise<any>{
    try {
      // Check if the user already exists
      
      const userValidate = await this.userRepository.findOne({
        where: { email: createAuthDto.email },
      });

      if (!userValidate) {
        throw new UnauthorizedException('The user does not exists!');
      }
      const isMatch = await bcrypt.compare(createAuthDto.password, userValidate.password);
      if (!isMatch) {
        throw new UnauthorizedException('The password does not exists!');
      }
      // Create and save the new user
      // const newUser = await this.userRepository.create(createAuthDto);
      // const userSaved = await this.userRepository.save(newUser);

      // Create token payload with necessary information (excluding sensitive data)
      
      return userValidate
      
    } catch (error) {
      // Handle errors, log or rethrow as needed
      console.error('User creation failed', error);
      throw error;
    }
    // return 'This action adds a new auth';
  }
  async updateProfileImage(id, image: Express.Multer.File): Promise<any> {
    // Check if the user exists    
    // const user = await this.userRepository.findOneOrFail(userId, { relations: ['profile_image'] });
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile_image'],
    });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // Validate image file format
    if (!['.jpeg', '.png', '.gif', '.jpg', '.avif'].includes(path.extname(image.originalname).toLowerCase())) {
      throw new BadRequestException('Invalid image file format');
    }
  
    if (user.profile_image) {
      // Update existing profile image entity
      user.profile_image.name = image.originalname;
      user.profile_image.content = image.buffer;
      user.profile_image.ext = path.extname(image.originalname).toLowerCase().slice(1).trim();
      user.profile_image.base64 = image.buffer.toString('base64');
  
      // Save the updated profile image entity to the database
      await this.ProfileImageBgRepository.save(user.profile_image);
    } else {
      // Create new profile image entity
      const newProfileImage = new ProfileImage({
        name: image.originalname,
        content: image.buffer,
        ext: path.extname(image.originalname).toLowerCase().slice(1).trim(),
        base64: image.buffer.toString('base64'),
      });
  
      // Save the new profile image entity to the database
      user.profile_image = await this.ProfileImageBgRepository.save(newProfileImage);
    }
  
    // Save the updated user entity to the database
    return await this.userRepository.save(user);
  }
  
  async updateProfileBg(id, image: { originalname: string, buffer: Buffer }): Promise<User> {
    // Check if the user exists    
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile_bg'],
      // relations: {profile_bg: true, profile_image : true},
    });
    
    
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // Validate image file format
    if (!['.jpeg', '.png', '.gif', '.jpg', '.avif'].includes(path.extname(image.originalname).toLowerCase())) {
      throw new BadRequestException('Invalid image file format');
    }
  
    if (user.profile_bg) {
      // Update existing profile background entity
      user.profile_bg.name = image.originalname;
      user.profile_bg.content = image.buffer;
      user.profile_bg.ext = path.extname(image.originalname).toLowerCase().slice(1).trim();
      user.profile_bg.base64 = image.buffer.toString('base64');
  
      // Save the updated profile background entity to the database
      await this.ProfileBgRepository.save(user.profile_bg);
    } else {
      // Create new profile background entity
      const newProfileBg = new ProfileBg({
        name: image.originalname,
        content: image.buffer,
        ext: path.extname(image.originalname).toLowerCase().slice(1).trim(),
        base64: image.buffer.toString('base64'),
      });
  
      // Save the new profile background entity to the database
      user.profile_bg = await this.ProfileBgRepository.save(newProfileBg);
    }
  
    // Save the updated user entity to the database
    return await this.userRepository.save(user);
  }
  async findByPro(id){
    const user = await this.userRepository.findOne({
      where: { id },
      // relations: ['profile_image'],
      relations: {profile_bg: true, profile_image : true},
    });

    return user
  }
  async findAll() {
    const user = await this.userRepository.find({      
      // relations: ['profile_image'],
      relations: {profile_bg: true, profile_image : true},
    });

    return user
  }

  async findAllUserHouse(id) {
    const user = await this.userRepository.findOne({
      where: { id },
      // relations: ['profile_image'],
      relations: ['profile_bg','profile_image','files', 'files.cover_image'],
      // relations: ['profile_bg','profile_image','files', 'files.videos', 'files.images', 'files.cover_image'],
    });
    
    return user
  }

  async findOne(id) {
     // Create a custom query using the query builder
     const userWithFiles = await this.userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.files', 'files')
    .leftJoinAndSelect('files.cover_image', 'cover_image')
    .where('user.id = :id', { id })
    .orderBy('files.createdAt', 'DESC') // Order files by createdAt timestamp in descending order
    .getOne();
console.log(userWithFiles)
// Access the files associated with the user
if (userWithFiles) {
  const files = userWithFiles.files;
  console.log(files);
  return files;
} else {
console.log('User not found');
}
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
