import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
/*** imports to handle image on backend server */
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';
import { SERVER_URL } from 'src/config/constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  // login function ****************************************************/
  async login(email: string, password: string) {
    try {
      console.log('Im at auth.service - line 18 - email: ' + email);
      const user: any = await this.userService.getUserByEmail(email);

      console.log('Im at auth.service - line 20 - Login user: ' + user);

      if (await this.verifyPassword(user, password, user.password)) {
        delete user.password;

        const accessToken = await this.jwtService.signAsync({
          sub: user.id,
          email: user.email,
        });

        console.log('Im at auth.service - line 30 - Login Successfull');
        return  ({message: 'Login successful', user, accessToken });};
          } catch (error: any) {
      return error;
    }
  }

  //  End of login function block ***************************/
  // SignUp function ****************************************/
  async signup(
    email: string,
    password: string,
    fullName: string,
    isAdmin: string,
    file: Express.Multer.File,
  ) {
    try {
      const hashedPassword = this.hashPassword(password);
      console.log(
        'Im at auth.service - line 54 - hashedPassword: ' + hashedPassword,
      );
      const imagePath = file
      ? `/uploads/${file.filename}`
      : `${SERVER_URL}/uploads/image.jpg`;
      const newUserData = {
        email: email,
        fullName: fullName,
        isAdmin: isAdmin,
        password: hashedPassword,
        image: imagePath,
      };
      const newUser: any = await this.userService.create(newUserData);
      console.log('Im at auth.service - line 67 - NewUser: ' + newUser);
      return  newUser;
    } catch (error) {
      return error;
    }
  }
  // function to get a least one admin
  async getoneAdmin(): Promise<User[]> {
    const getAdmin: any = this.userService.findOneAdmin();
    console.log(
      'Im at - auth.service - getoneAdmin - line 77 - getAdmin: ' + getAdmin,
    );
    return  getAdmin;
  }

  hashPassword(password: string) {
    return bcrypt.hashSync(password, 10);
  }

  async verifyPassword(user: User, password: string, hashedPassword: string) {
    return user && (await bcrypt.compare(password, hashedPassword));
  }
}
