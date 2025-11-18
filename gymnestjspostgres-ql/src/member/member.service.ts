import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Member } from './entities/member.entity';
/*** imports to handle image on backend server */
import { Response } from 'express';
import { SERVER_URL } from 'src/config/constants';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    private configService: ConfigService,
  ) {}
  // function to create a member

  async createMember(
    namemember: string,
    client_CI: string,
    email: string,
    phone: string,
    nameplan: string,
    timedays: number,
    cost: number,
    code: string,
    file: Express.Multer.File,
  ) {
    /**** Check if user exist in database */
    const emailExists = await this.memberRepository.findOne({
      where: { email },
    });

    console.log(
      'Estoy en  member.service - line 34 - emailExists:  ',
      emailExists,
    );
    if (emailExists) {
      console.log(
        'Estoy en  member.service -Dentro de emailExist- line 39 - emailExists: ',
        emailExists,
      );
      if (!emailExists) {
        throw new NotFoundException('User Not Exist ....');
      }
    }
    /** End of block for been checking if user exist  */
    // Get the current date
    const currentDate = new Date();
    // Add timedays days to the current date
    const futureDate: any = new Date(
      currentDate.getTime() + timedays * 24 * 60 * 60 * 1000,
    );
    // Add timedays to get finish Member time
    // # days to finish this member, starting with today
    const leftdays: any = new Date(currentDate.getTime() - futureDate);
    const Status = 'true';
    console.log('Im at member.services.ts - line 56 - leftdays:', leftdays);

    const imagePath = file
      ? `/uploads/${file.filename}`
      : `${SERVER_URL}/uploads/image.jpg`;

    const GetMemberParams = {
      namemember: namemember,
      client_CI: client_CI,
      email: email,
      phone: phone,
      nameplan: nameplan,
      timedays: timedays,
      cost: cost,
      code: code,
      status: Status,
      leftdays: leftdays,
      createdAt: new Date(),
      finishAt: futureDate,
      image: imagePath,
    };
    const newMember: any = await this.memberRepository.save(GetMemberParams);
    return newMember as Member;
  }
  /**** end of the block to create a Member document *******************/
  /*** function to get all members ************************************/
  async findAllMembers(page = 1, limit = 20) {
    console.log('Estoy en memberController - line 80 - findAllMembers');
    const [members, total] = await this.memberRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });
    if (total > 0) {
      console.log(
        'Estoy en member.service - line 87 - listAllMembers: ' +
          members[0].namemember,
      );
      console.log('Estoy en member.service - line 90 - total: ' + total);
      return { members, total };
    }
    console.log('Estoy en member.service - line 93 - total: ' + total);
    if (total == 0) {
      const Members = {};
      console.log('Estoy en member.service - line 96 - total: ', total);
      return { members: Members, total };
    }
  }
  /***** End of function to get all Members *******************************/
  /*****************  function to get a member by Email ***********************/
  async findmemberByEmail(email: string) {
    const memberByEmail: any = await this.memberRepository.findOne({
      where: { email },
    });
    console.log(
      'Estoy en memberService - line 107 - memberByEmail.nameplan: ',
      memberByEmail.namemember,
    );
    console.log(
      'Estoy en memberService - line 111 - memberByEmail.image: ',
      memberByEmail.image,
    );
    if (!memberByEmail) {
      throw new NotFoundException('member not found');
    }
    return memberByEmail as Member;
  }

  /*********************** end of function to get a member by Email  *********/
}
