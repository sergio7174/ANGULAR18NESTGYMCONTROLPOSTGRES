import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(user: any) {
    try {
      //const newUser: any = this.userRepository.create(user);
      const newUserCreated: any = await this.userRepository.save(user);
      console.log(
        'Im at users.service - line 18 - newUserCreated: ' + newUserCreated,
      );
      return newUserCreated as User;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUserById(id: string) {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['orders'],
    });
  }

  async getUserByEmail(email: string) {
    console.log(
      'Im at users.service - line 34 - getUserByEmail - email: ' + email)
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findOneByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async findAll(page = 1, limit = 20) {
    return await this.userRepository.find({
      take: limit,
      skip: (page - 1) * limit,
    });
  }
  /*** function to get all users ************************************/
  async findAllusers(page = 1, limit = 20) {
    console.log('Estoy en users.service - line 52 - findAllusers');
    const [users, total] = await this.userRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });
    if (total > 0) {
      console.log(
        'Estoy en user.service - line 59 - users[0].email: ' + users[0].email);
      console.log('Estoy en userController - line 59 - total: ' + total);
      console.log(
        'Estoy en user.service - line 62 - users[0].id: ' + users[0].id);
      return { users, total };
    }
    if (total == 0) {
      const Users = {};
      console.log('Estoy en users.service - line 67 - total: ', total);
      return { users: Users, total };
    }
  }
  /***** End of function to get all users *******************************/

  async findOneAdmin() {
    const isAdmin: any = 'true';
    const gotAdmin: any = await this.userRepository.findOne({
      where: { isAdmin },
    });
    if (gotAdmin) {
      console.log(
        'Im at users.service - line 74 - gotAdmin.email: ' + gotAdmin.email);
      return gotAdmin as User;
    }
  }
}
