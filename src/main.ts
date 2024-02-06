/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { JwtGuard } from './files/guards/jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'], // Include 'PATCH' in the allowed methods
  });
  
  // app.enableCors({
  //   origin: true,
  //   // origin: 'http://localhost:5173',
  //   credentials: true,
  //   "methods": ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
  // });
  
  app.use(cookieParser());

    app.useGlobalPipes(new ValidationPipe({
      whitelist : true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

     // Apply JwtGuard globally
   // Create instances of JwtService and ConfigService
  //  const jwtService = app.get(JwtService);
  //  const configService = app.get(ConfigService);
 
   // Apply JwtGuard globally with the required parameters
  //  app.useGlobalGuards(new JwtGuard(jwtService, configService));

  await app.listen(3000);
}
bootstrap();
