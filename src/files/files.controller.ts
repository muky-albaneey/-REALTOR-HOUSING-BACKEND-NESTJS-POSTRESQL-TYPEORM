/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
ValidationPipe,
UseInterceptors, 
UploadedFiles,
UseGuards,
Request, 
ParseUUIDPipe,
UploadedFile

} from '@nestjs/common';
// import type { Request } from 'express';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { JwtGuard } from './guards/jwt.guard';
import { parse as parseUuid } from 'uuid';


@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  
  // @UseGuards(JwtGuard)
  @Post('file_info/:id')
  async create(@Body() createFileDto: CreateFileDto, @Param('id',ParseUUIDPipe) id: string, @Request() req) {  
    // const user = req['userId'].sub;
    const result = await this.filesService.create(createFileDto,id);
  // console.log(user)
  
    // if (user) {
    //   console.log('User ID:', user);
      return result;
      
    // } else {
    //   console.log('User ID is undefined');
    // }  

    // return result;
  }

  @Get('allfiles')
  findAll() {
    const result = this.filesService.findAll();
    console.log(result)
    return result;
  }

  @Get('single/:id')
  findOne(@Param('id',ParseUUIDPipe) id: string) {
    const result = this.filesService.findOne(id);
    console.log(result)
    return result;
  }

  // @UseGuards(JwtGuard)
  @Patch('uploads/:id')
  @UseInterceptors(FilesInterceptor('file'))
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id', ParseUUIDPipe) id: string, @UploadedFiles() files) {
      
    try {
      // Call the service method to handle file uploads
     const result = await this.filesService.updateImages(id, files);
     console.log(result)

      // If successful, return a response with a 200 status code
      return result;

    } catch (error) {
      // If there's an error, return a response with a 400 status code
      return { message: 'Error saving files to the database.', error };
    }
    
  }
  
  @Patch('cover_img/:id')
  @UseInterceptors(FileInterceptor ('file'))
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateCoverImg(@Param('id', ParseUUIDPipe) id: string, @UploadedFile() file: Express.Multer.File) {
  // async createProfileImg(@Param('id', ParseUUIDPipe) id: string, @Body() createFileDto) {  
    
    const result = await this.filesService.updateCoverImage(id, file); 
    console.log(result)
    return result;
    // return 5
  }

  // @Patch('cover/:id')
  // @UseInterceptors(FileInterceptor ('file'))
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async updateCoverImg(@Param('id', ParseUUIDPipe) id: string, @UploadedFile() file: Express.Multer.File) {
  // // async createProfileImg(@Param('id', ParseUUIDPipe) id: string, @Body() createFileDto) {  
    
  //   const result = await this.filesService.updateCoverImage(id, file); 
  //   console.log(result)
  //   return result;
  // }

  // @UseGuards(JwtGuard)
  @Patch('videos/:id')
  @UseInterceptors(FilesInterceptor('file'))
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateVideos(@Param('id', ParseUUIDPipe) id: string, @UploadedFiles() files) {
   
    try {
     console.log(id)
      const result = await this.filesService.updateVideo(id, files);
      console.log(result);
      return result
      
    } catch (error) {
      // If there's an error, return a response with a 400 status code
      return { message: 'Error saving files to the database.', error };
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }
}
