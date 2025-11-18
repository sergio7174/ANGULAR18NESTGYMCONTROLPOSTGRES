import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Staff } from './entities/staff.entity';
/*** imports to handle image on backend server */
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';
import { SERVER_URL } from 'src/config/constants';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    private configService: ConfigService,
  ) {}
  /****function to create an Staff document ****************************/
  async createStaff(
    name: string,
    email: string,
    age: number,
    id_card: string,
    phone: string,
    address: string,
    gender: string,
    field: string,
    file: Express.Multer.File,
  ) {
    console.log('Im at staff.services.ts - line 30 - name:' + name);

    const imagePath = file
      ? `/uploads/${file.filename}`
      : `${SERVER_URL}/uploads/image.jpg`;

    const GetStaffParams = {
      name: name,
      email: email,
      age: age,
      id_card: id_card,
      phone: phone,
      address: address,
      gender: gender,
      field: field,
      image: imagePath,
      createdAt: new Date(),
    };

    const newStaff: any = await this.staffRepository.save(GetStaffParams);
    return newStaff as Staff;
  }
  /**** end of the block to create an Staff document *******************/

  /*****************  function to put(update) an staff by Id ***********************/
  async updateStaff(
    id: string,
    name: string,
    email: string,
    age: number,
    id_card: string,
    phone: string,
    address: string,
    gender: string,
    field: string,
    file: Express.Multer.File,
  ) {
    const imagePath = file
      ? `/uploads/${file.filename}`
      : `${SERVER_URL}/uploads/image.jpg`;

    const itemStaff: any = await this.staffRepository.findOneBy({ id });
    console.log(
      'Estoy en StaffController - line 73 - updateStaff - itemStaff: ',
      itemStaff,
    );

    if (!itemStaff) {
      throw new NotFoundException('Staff not found');
    }
    if (itemStaff) {
      const GetStaffParams = {
        name: name,
        email: email,
        age: age,
        id_card: id_card,
        phone: phone,
        address: address,
        gender: gender,
        field: field,
        createdAt: new Date(),
        image: imagePath,
      };
      console.log(
        'Estoy en StaffController - line 94 - updateStaff - updated successfully',
      );
      // Apply partial updates from GetSupplierParams
      Object.assign(itemStaff, GetStaffParams);
      return this.staffRepository.save(itemStaff as Staff);
    }
  }
  /*****************  end of block function to put an staff by Id ***********************/
  /*** function to get all packs ************************************/
  async findAllStaffs(page = 1, limit = 20) {
    console.log('Estoy en StaffController - line 105 - findAllStaffs');
    const [staffs, total] = await this.staffRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });
    if (total > 0) {
      console.log(
        'Estoy en staff.service - line 112 - listAllStaffs: ',
        staffs[0].name,
      );
      console.log('Estoy en staff.service - line 115 - total: ' + total);
      return { staffs, total };
    }
    console.log('Estoy en staff.service - line 118 - total: ' + total);
    if (total == 0) {
      const Staffs = {};
      console.log('Estoy en staff.service - line 121 - total: ', total);
      return { staffs: Staffs, total };
    }
  }
  /***** End of function to get all Staffs *******************************/
  /*****************  function to get an Staff by Id ***********************/
  async findStaffById(id: string) {
    const staff: any = await this.staffRepository.findOne({
      where: { id },
    });
    console.log(
      'Estoy en staffService - line 132 - findStaffById: ',
      staff.name,
    );
    if (!staff) {
      throw new NotFoundException('Staff not found');
    }
    return staff as Staff;
  }

  /*********************** end of function to get an Staff by Id  *********/
  /**** function to erase image in upload dir */
  deleteImageStaff(image: string) {
    const Image: string = path.basename(image);
    const filePath = path.join(__dirname, '../../uploads', Image);
    console.log(
      'Estoy en staff.service.ts - line 147 - deleteImageStaff - image: ',
      filePath,
    );
    fs.unlink(filePath, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.log(
            'Estoy en staff.service.ts - line 154 - deleteImageStaff - File not found ',
          );
          const message: string = 'File not found';
          return message;
        }
        const message: string = 'Error deleting file';
        return message;
      }
      console.log(
        'Estoy en staff.service.ts - line 163 - deleteImageStaff - File deleted successfully ',
      );
      const message: string = 'File deleted successfully';
      return message;
    });
  }
  /**** End of block to erase image in upload dir *************************************/
  /**** funtion to delete an staff *******************************************************/
  async deleteStaff(id: string) {
    const deletedStaff = await this.staffRepository.delete(id);
    console.log(
      'Estoy en pack.service.ts - line 174 - deletePack : ',
      deletedStaff,
    );
    if (!deletedStaff) {
      const message: string = 'Staff not found ..';
      console.log(
        'Estoy en staff.service.ts - line 180 - deleteStaff - message : ',
        message,
      );
      return message;
    }
    const message: string = 'Staff Deleted Successfully ..';
    console.log(
      'Estoy en pack.service.ts - line 187 - deletePack - message : ',
      message,
    );
    return message;
  }
  /***** End of Block to funtion to delete an staff **************************************/
}
