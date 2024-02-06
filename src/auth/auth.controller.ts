/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, Res, ParseUUIDPipe, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto, UploadProfileDto } from './dto/update-auth.dto';
import { User } from './entities/user.entity';
// import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController{
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService, private readonly jwt: JwtService,) {}
  
  @Post('create')
    async create(@Body() createAuthDto: CreateAuthDto, @Res({ passthrough: true }) response: Response): Promise<any> {
    try {      
      
      const result = await this.authService.create(createAuthDto);
      const  email =  result.user.email
      const  id =  result.user.id
      const  role =  result.user.role
      const payload = { email: email, sub: id };
      const rolePayload = { role: role, sub: id };

      // Sign JWT for access token with a longer expiry time
      const jwtTokenKeys = await this.jwt.signAsync(payload, {
        expiresIn: '35s',
        secret: this.configService.get<string>('ACCESS_TOKEN'),   
      });

      // Sign JWT for refresh token with a longer expiry time
      const jwtRefreshTokenKeys = await this.jwt.signAsync(payload, {
        expiresIn: '7d',
        secret: this.configService.get<string>('REFRESH_TOKEN'),   
      });

        // Sign JWT for role token with a longer expiry time
        const roleToken = await this.jwt.signAsync(rolePayload, {
          expiresIn: '7d',
          secret: this.configService.get<string>('ROLE_TOKEN'),   
        });

        // Set HttpOnly cookie for the access token
      response.cookie('accessToken', jwtTokenKeys, {
        // httpOnly: false,
        // secure: false,
        maxAge: 7 * 60 * 60 * 1000,  // 7 hours in milliseconds
        // path: '/',
        // sameSite: 'none',
      });

      // Set HttpOnly cookie for the refresh token (if needed)
      response.cookie('refreshToken', jwtRefreshTokenKeys, {
        // httpOnly: false,
        // secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        // path: '/', 
        // sameSite: 'none',
      });

      // Set HttpOnly cookie for the role token (if needed)
      response.cookie('roleToken', roleToken, {
        // httpOnly: true,
        // secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        // path: '/', 
        // sameSite: 'none',
      });
  return result;
    } catch (error) {
      console.error('User creation failed', error);
      throw error;
    }
  }

  @Post('login')
  async login(@Body() createAuthDto: CreateAuthDto, @Res({ passthrough: true }) response: Response): Promise<any> {
    console.log(createAuthDto.email)
    console.log(createAuthDto.password)
  try {      
    
    const result = await this.authService.login(createAuthDto);
    console.log(result)
    const  email =  result.email
    const  id =  result.id
    const  role =  result.role
    const payload = { email: email, sub: id };
    const rolePayload = { role: role, sub: id };

    // Sign JWT for access token with a longer expiry time
    const jwtTokenKeys = await this.jwt.signAsync(payload, {
      expiresIn: '35s',
      secret: this.configService.get<string>('ACCESS_TOKEN'),   
    });

    // Sign JWT for refresh token with a longer expiry time
    const jwtRefreshTokenKeys = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: this.configService.get<string>('REFRESH_TOKEN'),   
    });

      // Sign JWT for role token with a longer expiry time
      const roleToken = await this.jwt.signAsync(rolePayload, {
        expiresIn: '7d',
        secret: this.configService.get<string>('ROLE_TOKEN'),   
      });

      // Set HttpOnly cookie for the access token
    response.cookie('accessToken', jwtTokenKeys, {
      // httpOnly: false,
      // secure: false,
      maxAge: 7 * 60 * 60 * 1000,  // 7 hours in milliseconds
      // path: '/',
      // sameSite: 'none',
    });

    // Set HttpOnly cookie for the refresh token (if needed)
    response.cookie('refreshToken', jwtRefreshTokenKeys, {
      // httpOnly: false,
      // secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      // path: '/', 
      // sameSite: 'none',
    });

    // Set HttpOnly cookie for the role token (if needed)
    response.cookie('roleToken', roleToken, {
      // httpOnly: true,
      // secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      // path: '/', 
      // sameSite: 'none',
    });
return result;
  } catch (error) {
    console.error('User creation failed', error);
    throw error;
  }
}

  @Patch('profiles/:id')
  @UseInterceptors(FileInterceptor ('avatar'))
  @UsePipes(new ValidationPipe({ transform: true }))
  async uploadProfile(@Param('id', ParseUUIDPipe) id: string, @UploadedFile() file: Express.Multer.File) {
  // async createProfileImg(@Param('id', ParseUUIDPipe) id: string, @Body() createFileDto) {  
    
    const result = await this.authService.updateProfileImage(id, file); 
    console.log(result)
    return result;
  }

  @Patch('bg/:id')
  @UseInterceptors(FileInterceptor ('bg'))
  @UsePipes(new ValidationPipe({ transform: true }))
  async uploadBackground(@Param('id', ParseUUIDPipe) id: string, @UploadedFile() file: Express.Multer.File) {
  // async createProfileImg(@Param('id', ParseUUIDPipe) id: string, @Body() createFileDto) {  
    
    const result = await this.authService.updateProfileBg(id, file); 
    console.log(result)
    return result;
  }

  @Get('all')
  findAll() {
    return this.authService.findAll();
  }

  @Get('user_file_single/:id')
  findOneFile(@Param('id', ParseUUIDPipe) id: string) {
    const result = this.authService.findOne(id);
    console.log(result)
    return result;
  }

  @Get('user_files/:id')
  findAllUserHouse(@Param('id', ParseUUIDPipe) id: string) {
    const result = this.authService.findAllUserHouse(id);
    console.log(result)
    return result;
  }

  @Get('profile/:id')
  async findProfile(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.authService.findAllUserHouse(id);
    console.log(result)
    return result;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
