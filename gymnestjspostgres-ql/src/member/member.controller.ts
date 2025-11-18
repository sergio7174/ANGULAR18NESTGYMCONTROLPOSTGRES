// src/member/member.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
/*** TO HANDLE IMAGES WITH MULTER */
import { FileInterceptor } from '@nestjs/platform-express';
import { imageUploadOptions } from '../config/file-upload.config';
import { MemberService } from './member.service';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  /*** function to create a Member document *********************************/
  @Post('')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  async createMember(
    @Res() res: Response,
    @Body('namemember') namemember: string,
    @Body('client_CI') client_CI: string,
    @Body('email') email: string,
    @Body('phone') phone: string,
    @Body('nameplan') nameplan: string,
    @Body('timedays') timedays: number,
    @Body('cost') cost: number,
    @Body('code') code: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(
      'Im at member.controller.ts - line 42 - go to memberService.createMember - image:'
    );
    const NewMember: any = await this.memberService.createMember(
      namemember,
      client_CI,
      email,
      phone,
      nameplan,
      timedays,
      cost,
      code,
      file,
    );
    if (NewMember) {
      console.log(
        'Im at member.controller.ts - line 57 - Member Created Successfully ..',
      );
      return res.status(200).send({
        NewMember: NewMember,
        message: 'Member Created Successfully ..',
      });
    }
    if (!NewMember) {
      console.log(
        'Im at member.controller.ts - line 66 - Member Not Created Successfully ..',
      );
      res.status(200).send({ message: 'Member Not Created successfully' });
    }
  }
  /*** end of function to create a Member document *********************************/
  /**** function to get all members ******************************** */
  @Get('listAll')
  async listAll(
    @Req()
    req: Request,
    @Res() res: Response,
  ) {
    console.log('Im at member.controller.ts - line 79');
    const members: any = await this.memberService.findAllMembers();
    console.log(
      'Im at member.controller.ts - line 82 - members.length: ',
      members.total,
    );
    return res.status(200).send({
      message: 'All Members fetched successfully',
      total: members.total,
      members: members.members,
      data:members.members, // for redux-toolkit query req
    });
  }
  /**** end of function to get all Members  ******************************** */
  /*********** function to get a member by email ********************************/
  @Get('get-single-memberbyemail/:email')
  async getmemberById(
    @Param('email') email: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    console.log(
      'Im at member.controller.ts - line 101 - get-single-member/:email ',
      email,
    );
    const member: any = await this.memberService.findmemberByEmail(email);
    //const memberByEmail: any = member.memberByEmail;
     console.log(
      'Im at member.controller.ts - line 106 - get-single-member/:email - member: ',
      member,
    );
    return res.status(200).send({
      message: 'Single member Fetched Successfully',
      data:member,
      member: member,
    });
  }
  /*********** end of function to get a member by email ***************************/
}
