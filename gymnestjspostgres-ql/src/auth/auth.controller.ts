// src/auth/auth.controller.ts
import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
/*** TO HANDLE IMAGES WITH MULTER */
import { FileInterceptor } from '@nestjs/platform-express';
import { imageUploadOptions } from '../config/file-upload.config';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  signup(
    @Body('fullName') fullName: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('isAdmin') isAdmin: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(
      'Im at auth controller- SignUp - line 32 -Request body- fullName:' +
        fullName,
    );
    const newUser: any = this.authService.signup(
      email,
      password,
      fullName,
      isAdmin,
      file,
    );

    console.log('Im at auth.controller-register-line 43');
    console.log('- User registered successfully: ' + newUser);
    return { message: 'User registered successfully', newUser: newUser };
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    console.log(
      'Im at auth controller- login - line 56 - Request body- email:' + email,
    );
    const LoginUser = await this.authService.login(email, password)
    if (!LoginUser) {
      console.log('Im at auth.controller-login-line 60- Invalid credentials: ');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log(
      'Im at auth.controller-login-line 64- LoginUser.data.user: ' +
        LoginUser.user,
    );
    console.log(
      'Im at auth.controller-login-line 68- Log inUser.data.accesstoken: ' +
        LoginUser.accessToken,
    );
    return res.status(200).json({
      user:LoginUser.user,
      message: 'User Login Successfully ..',
      token:LoginUser.accessToken});
  }
  //  function to get al least one admin in database
  @Get('getoneAdmin')
  async getoneAdmin(@Req() req: Request, @Res() res: Response) {
    console.log('Im at auth.controller-get one admin -line 79: ');
    const isAdmin = await this.authService.getoneAdmin();
    console.log(
      'Im at auth.controller-get all admin -line 67- isAdmin[0]: ' + isAdmin,
    );
    if (isAdmin == undefined) {
      const isFalse: string = 'false';
      console.log('Im at auth.controller-get all admin -line 85- No Admin: ');
      return res.status(200).json({ message: 'No Admin', haveAdmin: isFalse });
    }
    if (isAdmin != undefined) {
      console.log(
        'Im at auth.controller-get one admin -line 75- isAdmin.email: ' +
          isAdmin,
      );
      return res.status(200).json({ haveAdmin: isAdmin });
    }
  }
}
