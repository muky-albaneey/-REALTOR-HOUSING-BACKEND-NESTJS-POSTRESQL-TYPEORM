/* eslint-disable prettier/prettier */

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { File, ApartmentsType, Category } from './entities/file.entity';
import { User, UserRole } from '../auth/entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import * as path from 'path';
import { Vid } from './entities/vid.entity';
import { Cover } from './entities/cover.entity';

@Injectable()
export class FilesService {
   // Create a database connection
   constructor(
    @InjectRepository(File)
    private readonly filesRepository: Repository<File>,
    
    @InjectRepository(File)
    private readonly CoverRepository: Repository<Cover>,

    @InjectRepository(Image)
    private readonly imagesRepository: Repository<Image>,

    @InjectRepository(Vid)
    private readonly VidesRepository: Repository<Vid>,

    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,

    private readonly entityManager : EntityManager
  ){}
  async create(createFileDto: CreateFileDto, id): Promise<any> {
    try {
      // Uncomment and adapt the following lines if you are using a service or other methods to connect to the database

      // Check if the user exists
      // const existingUser = await this.entityManager.findOne(User, id);
      // const existingUser = await this.entityManager.findOne(User, {id });
      
      const existingUser = await this.UserRepository.findOne({
        where : {id}
      });
console.log(existingUser)
      if (existingUser) {
        const file = new File({
          address: createFileDto.address,
          city: createFileDto.city,
          country: createFileDto.country,
          type: createFileDto.type,
          amount: createFileDto.amount,
          description: createFileDto.description,
          category: createFileDto.category,
          floorspace: createFileDto.floorspace,
          beds: createFileDto.beds,
          baths: createFileDto.baths,
          Furnishing: createFileDto.Furnishing,
          user: id,  // Use the existing user retrieved from the database
          images: [],
          videos: [],
          cover_image : null
        });

      //   // Save the file to the database
        const savedFile = await this.entityManager.save(File, file);

        console.log('File added to the user successfully.');
        return savedFile;
      } else {
        throw new NotFoundException('User not found');
      }
    } finally {
      // Uncomment if you are using a service or other methods to connect to the database
      // Close the database connection
      // await connection.close();
    }
  }

  async findAll() {
   return  await this.filesRepository.find({
      relations: {          
        cover_image: true,
        //   videos: true,
      },
      order: {
        createdAt: "DESC",
    },
  })
  }
  

 async findOne(id) {
    const findApartment = await this.filesRepository.findOne({
      where : {id},
      relations : {images: true, videos : true,  cover_image :true}
    });

    return findApartment;
  }

  async updateCoverImage(id, image: { originalname: string, buffer: Buffer }): Promise<any> {
    // Check if the file exists    
    const file = await this.filesRepository.findOneOrFail({
      where: { id },
      relations: { cover_image: true },
    });
    // console.log(image)
    if (!file) {
      throw new NotFoundException('File not found');
    }
  
    // Validate image file format
    const validImageFormats = ['.jpeg', '.png', '.gif', '.jpg', '.avif'];
    if (!validImageFormats.includes(path.extname(image.originalname).toLowerCase())) {
      throw new BadRequestException('Invalid image file format');
    }
  
    // Check if a cover image already exists for this file
    const existingCoverImage = file.cover_image;
  
    if (existingCoverImage) {
      // Update existing cover image entity
      existingCoverImage.name = image.originalname;
      existingCoverImage.content = image.buffer;
      existingCoverImage.ext = path.extname(image.originalname).toLowerCase().slice(1).trim();
      existingCoverImage.base64 = image.buffer.toString('base64');
  
      const updatedFile = {
        ...file,
        cover_image: existingCoverImage,
      };
      
      // Save the updated file entity to the database
      return await this.filesRepository.save(updatedFile);
      // return await this.filesRepository.save(file);
      
      // return file
    } else {
      // Create new cover image entity
      const newCoverImage = new Cover({
        name: image.originalname,
        content: image.buffer,
        ext: path.extname(image.originalname).toLowerCase().slice(1).trim(),
        base64: image.buffer.toString('base64'),
      });
      
      const updatedFile = {
        ...file,
        cover_image: newCoverImage,
      };
      // console.log(updatedFile)
      // Save the updated file entity to the database
      return await this.filesRepository.save(updatedFile);
  
      // Save the new cover image entity to the database
      // const savedCoverImage = await this.CoverRepository.save(newCoverImage);
  
      // Assign saved cover image to the file entity
      // file.cover_image = savedCoverImage;
  
      // Save the updated file entity to the database
      // return await this.filesRepository.save(file);
    }
  }
  
  

  // async updateCoverImg(id, image: { originalname: string, buffer: Buffer }): Promise<File> {
  //   // Check if the user exists    
  //   const file = await this.filesRepository.findOne({
  //     where: { id },
  //     relations: ['cover_image'],
  //     // relations: {profile_bg: true, profile_image : true},
  //   });
    
    
  
  //   if (!file) {
  //     throw new NotFoundException('User not found');
  //   }
  
  //   // Validate image file format
  //   if (!['.jpeg', '.png', '.gif', '.jpg', '.avif'].includes(path.extname(image.originalname).toLowerCase())) {
  //     throw new BadRequestException('Invalid image file format');
  //   }
  
  //   if (file.cover_image) {
  //     // Update existing profile background entity
  //     file.cover_image.name = image.originalname;
  //     file.cover_image.content = image.buffer;
  //     file.cover_image.ext = path.extname(image.originalname).toLowerCase().slice(1).trim();
  //     file.cover_image.base64 = image.buffer.toString('base64');
  
  //     // Save the updated profile background entity to the database
  //     await this.CoverRepository.save(file.cover_image);
  //   } else {
  //     // Create new profile background entity
  //     const newProfileBg = new Cover({
  //       name: image.originalname,
  //       content: image.buffer,
  //       ext: path.extname(image.originalname).toLowerCase().slice(1).trim(),
  //       base64: image.buffer.toString('base64'),
  //     });
  
  //     // Save the new profile background entity to the database
  //     file.cover_image = await this.CoverRepository.save(newProfileBg);
  //   }
  
  //   // Save the updated user entity to the database
  //   return await this.filesRepository.save(file);
  // }
async updateVideo(id, videos: Array<{ originalname: string, buffer: Buffer }>): Promise<any> {
  // Check if the file exists    
  const file = await this.filesRepository.findOneOrFail({
    where: { id },
    relations: { videos: true },
  });

  if (!file) {
    throw new NotFoundException('File not found');
  }

  // Validate video file formats
  const invalidVideoFormats = videos.some((video) => !['.mp4', '.avi', '.mov'].includes(
    path.extname(video.originalname).toLowerCase()
  ));

  if (invalidVideoFormats) {
    throw new BadRequestException('Invalid video file format');
  }

  // Check if a video with the same name already exists for this file
  const existingVideo = file.videos.find((video) => video.name === videos[0].originalname);

  if (existingVideo) {
    // Update existing video entity
    existingVideo.name = videos[0].originalname;
    existingVideo.content = videos[0].buffer;
    existingVideo.ext = path.extname(videos[0].originalname).toLowerCase().slice(1).trim();
    existingVideo.base64 = videos[0].buffer.toString('base64');

    // Save the updated video entity to the database
     await this.VidesRepository.save(existingVideo);

    // Include the existing video in the array
    file.videos = [...file.videos, existingVideo];

    // Save the updated file entity to the database
    return await this.filesRepository.save(file);
  } else {
    // Create new video entities
    const videoEntities = videos.map((video) => {

       // Validate video file format
      if (!['.mp4', '.avi', '.mov'].includes(path.extname(video.originalname).toLowerCase())) {
        throw new BadRequestException('Invalid video file format');
      }

      const newVideo = new Vid({
        name: video.originalname,
        content: video.buffer,
        ext: path.extname(video.originalname).toLowerCase().slice(1).trim(),
        base64: video.buffer.toString('base64'),
      });

      return newVideo;
    });

 
      // const savedVideos = await this.VidesRepository.save(videoEntities);    
        const savedVideos = await this.VidesRepository.save(videoEntities);

        // Assign saved videos to existing videos array
        file.videos = [...file.videos, ...savedVideos];
  
        // Save the updated file entity to the database
        return await this.filesRepository.save(file);
  }  
  
}

async updateImages(id, images: Array<{ originalname: string, buffer: Buffer }>): Promise<any> {
  // Check if the file exists    
  const file = await this.filesRepository.findOneOrFail({
    where: { id },
    relations: { images: true },
  });

  if (!file) {
    throw new NotFoundException('File not found');
  }
   // Validate image file formats
    const invalidImageFormats = images.some((image) => !['.jpeg', '.png', '.gif', '.jpg', '.avif'].includes(
      path.extname(image.originalname).toLowerCase()
    )); 

    if (invalidImageFormats) {
      throw new BadRequestException('Invalid image file format');
    }

  // Check if an image with the same name already exists for this file
  const existingImage = file.images.find((image) => image.name === images[0].originalname);

  if (existingImage) {
    // Update existing image entity
    existingImage.name = images[0].originalname;
    existingImage.content = images[0].buffer;
    existingImage.ext = path.extname(images[0].originalname).toLowerCase().slice(1).trim();
    existingImage.base64 = images[0].buffer.toString('base64');
    
    // Save the updated image entity to the database
    await this.imagesRepository.save(existingImage);

    // Include the existing image in the array
    file.images = [...file.images, existingImage];

    // Save the updated file entity to the database
    return await this.filesRepository.save(file);
  } else {
    // Create new image entities
    const imageEntities = images.map((image) => {

      // Validate image file format
      if (!['.jpeg', '.png', '.gif', '.jpg', '.avif'].includes(path.extname(image.originalname).toLowerCase())) {
        throw new BadRequestException('Invalid image file format');
      }

      const newImage = new Image({
        name: image.originalname,
        content: image.buffer,
        ext: path.extname(image.originalname).toLowerCase().slice(1).trim(),
        base64: image.buffer.toString('base64'),
      });

      return newImage;
    }); 


     // Save the new image entities to the database
     const savedImages = await this.imagesRepository.save(imageEntities);

     // Assign saved images to existing images array
     file.images = [...file.images, ...savedImages];

     // Save the updated file entity to the database
     return await this.filesRepository.save(file);
  }
}


  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
