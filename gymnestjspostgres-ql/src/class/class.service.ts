import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Class } from './entities/class.entity';
/*** imports to handle image on backend server */
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';
import { SERVER_URL } from 'src/config/constants';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    private configService: ConfigService,
  ) {}

  /****function to create a class document ****************************/

  async createClass(
    classname: string,
    code: string,
    classday: string,
    classtime: string,
    classlevel: string,
    dateBegin: Date,
    session_time: number,
    price: number,
    trainer: string,
    key_benefits: string,
    expert_trainer: string,
    class_overview: string,
    why_matters: string,
    file: Express.Multer.File,
  ) {
    // Get the current date
    const currentDate = new Date();
    const SessionTime = session_time;
    console.log(
      'Im at class.services.ts - line 42 - createClass - SessionTime: ',
      SessionTime,
    );
    console.log(
      'Im at class.services.ts - line 46 - createClass - currentDate : ',
      currentDate,
    );
    // Add timedays days to the current date
    const futureDate = new Date(
      // Add session_time to get finish Class time
      currentDate.getTime() + SessionTime * 24 * 60 * 60 * 1000,
    );
    console.log(
      'Im at class.services.ts - line 55 - createClass - futureDate : ',
      futureDate,
    );
    const imagePath = file
      ? `/uploads/${file.filename}`
      : `${SERVER_URL}/uploads/image.jpg`;

    const GetClassParams = {
      classname: classname,
      code: code,
      classday: classday,
      classtime: classtime,
      classlevel: classlevel,
      dateBegin: dateBegin,
      dateEndClass: futureDate,
      session_time: session_time,
      price: price,
      trainer: trainer,
      key_benefits: key_benefits,
      expert_trainer: expert_trainer,
      why_matters: why_matters,
      class_overview: class_overview,
      createdAt: new Date(),
      finishAt: futureDate,
      image: imagePath,
    };

    const newClass: any = await this.classRepository.save(GetClassParams);
    return newClass as Class;
  }

  /**** end of the block to create a class document *******************/
  /*** function to get all classes ************************************/
  async findAllClasses(page = 1, limit = 20) {
    console.log('Estoy en ClassController - line 89 - findAllClasss');
    const [classes, total] = await this.classRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });
    if (total > 0) {
      console.log(
        'Estoy en class.service - line 96 - listAllCategories: ' +
          classes[0].classname,
      );
      console.log('Estoy en class.service - line 99 - total: ' + total);
      return { classes, total };
    }
    console.log('Estoy en class.service - line 102 - total: ' + total);
    if (total == 0) {
      const Classes = {};
      console.log('Estoy en class.service - line 105 - total: ', total);
      return { classes: Classes, total };
    }
  }
  /***** End of function to get all Classes *******************************/
  /*****************  function to get a class by Id ***********************/
  async findClassById(id: string) {
    const klass: any = await this.classRepository.findOne({
      where: { id },
    });
    console.log(
      'Estoy en ClassesService - line 116 - findClassById: ',
      klass.classname,
    );
    if (!klass) {
      throw new NotFoundException('Class not found');
    }
    return klass as Class;
  }

  /*********************** end of function to get a class by Id  *********/
  /*****************  function to put(update) a class by Id ***********************/

  async updateClass(
    id: string,
    classname: string,
    code: string,
    classday: string,
    classtime: string,
    classlevel: string,
    dateBegin: Date,
    session_time: number,
    price: number,
    trainer: string,
    key_benefits: string,
    expert_trainer: string,
    class_overview: string,
    why_matters: string,
    file: Express.Multer.File,
  ) {
    // Get the current date
    const currentDate = new Date();
    const SessionTime: any = session_time;

    // Add timedays days to the current date
    const futureDate = new Date(
      // Add session_time to get finish Class time
      currentDate.getTime() + SessionTime * 24 * 60 * 60 * 1000,
    );
    const imagePath = file
      ? `/uploads/${file.filename}`
      : `${SERVER_URL}/uploads/image.jpg`;
    const itemClass: any = await this.classRepository.findOneBy({ id });

    if (!itemClass) {
      throw new NotFoundException('Class not found');
    }
    const GetClassParams = {
      classname: classname,
      code: code,
      classday: classday,
      classtime: classtime,
      classlevel: classlevel,
      class_overview: class_overview,
      dateBegin: dateBegin,
      dateEndClass: futureDate,
      session_time: session_time,
      price: price,
      trainer: trainer,
      key_benefits: key_benefits,
      expert_trainer: expert_trainer,
      why_matters: why_matters,
      createdAt: new Date(),
      finishAt: futureDate,
      image: imagePath,
    };
    // Apply partial updates from GetSupplierParams
    Object.assign(itemClass, GetClassParams);
    return this.classRepository.save(itemClass as Class);
  }

  /*****************  end of block function to put a class by Id ***********************/

  /**** function to erase image in upload dir */
  deleteImageClass(image: string) {
    const Image: string = path.basename(image);
    const filePath = path.join(__dirname, '../../uploads', Image);
    console.log(
      'Estoy en category.service.ts-line 193-deleteImageCategory - image: ',
      filePath,
    );
    fs.unlink(filePath, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.log(
            'Estoy en class.service.ts - line 200 - deleteImageClass - File not found ',
          );
          const message: string = 'File not found';
          return message;
        }
        const message: string = 'Error deleting file';
        return message;
      }
      console.log(
        'Estoy en class.service.ts - line 209 - deleteImageCategory - File deleted successfully ',
      );
      const message: string = 'File deleted successfully';
      return message;
    });
  }
  /**** End of block to erase image in upload dir *************************************/
  /**** funtion to delete a class *******************************************************/

  async deleteClass(id: string) {
    const deletedClasses: any = await this.classRepository.delete(id);
    console.log(
      'Estoy en classes.service.ts - line 221 - deleteClass - deletedClasses : ',
      deletedClasses,
    );
    if (!deletedClasses) {
      const message: string = 'Class not found ..';
      console.log(
        'Estoy en classes.service.ts - line 227 - deleteClasses - message : ',
        message,
    );
      return message;
    }
    const message: string = 'Class Deleted Successfully ..';
    console.log(
      'Estoy en class.service.ts - line 234 - deleteClass - message : ',
      message,
    );
    return message;
  }
  /***** End of Block to funtion to delete a class **************************************/
}
