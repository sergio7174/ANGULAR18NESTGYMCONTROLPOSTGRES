// src/users/users.controller.ts
import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**** function to get all users ******************************** */

  @Get('listAll')
  async listAll(
    @Req()
    req: Request,
    @Res() res: Response,
  ) {
    console.log('Im at user.controller.ts - line 16');
    const users: any = await this.usersService.findAllusers();
    console.log(
      'Im at users.controller.ts - line 21 - users.length: ' + users.total
    );
    return res.status(200).send({
      message: 'All users fetched successfully',
      total: users.total,
      AllUsers: users.users,
    });
  }
  /**** end of function to get all users *********************************/
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get()
  getoneAdmin() {
    return this.usersService.findOneAdmin();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Get('email/:email')
  findOneByEmail(@Param('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }
}
