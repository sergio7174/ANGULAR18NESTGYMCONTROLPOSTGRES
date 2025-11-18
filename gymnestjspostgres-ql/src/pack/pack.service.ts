import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Pack } from './entities/pack.entity';
/*** imports to handle image on backend server */
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';
import { SERVER_URL } from 'src/config/constants';

@Injectable()
export class PackService {
  constructor(
    @InjectRepository(Pack)
    private packRepository: Repository<Pack>,
    private configService: ConfigService,
  ) {}
  /****function to create a pack document ****************************/

  async createPack(
    nameplan: string,
    trialdays: number,
    description: string,
    features: string,
    timedays: number,
    cost: number,
    code: string,
    status: string,
    file: Express.Multer.File,
  ) {
    console.log(
      'Im at pack.services.ts - line 33 - trialdaysFeatures:',
      timedays,
    );
    // Get the current date
    const currentDate = new Date();
    const SessionTime: any = timedays;
    // Add timedays days to the current date
    const futureDate = new Date(
      // Add session_time to get finish Class time
      currentDate.getTime() + SessionTime * 24 * 60 * 60 * 1000,
    );
    const imagePath = file
      ? `/uploads/${file.filename}`
      : `${SERVER_URL}/uploads/image.jpg`;

    const GetPackParams = {
      nameplan: nameplan,
      trialdays: trialdays,
      description: description,
      features: features,
      timedays: timedays,
      cost: cost,
      code: code,
      status: status,
      createdAt: new Date(),
      image: imagePath,
      finishAt: futureDate,
    };

    const newPack: any = await this.packRepository.save(GetPackParams);
    return newPack as Pack;
  }
  /**** end of the block to create a Pack document *******************/
  /*****************  function to put(update) a pack by Id ***********************/
  async updatePack(
    id: string,
    nameplan: string,
    trialdays: number,
    description: string,
    features: string,
    timedays: number,
    cost: number,
    code: string,
    status: string,
    file: Express.Multer.File,
  ) {
    // Get the current date
    const currentDate = new Date();
    const SessionTime: any = timedays;
    // Add timedays days to the current date
    const futureDate = new Date(
      // Add session_time to get finish Class time
      currentDate.getTime() + SessionTime * 24 * 60 * 60 * 1000,
    );
    const imagePath = file
      ? `/uploads/${file.filename}`
      : `${SERVER_URL}/uploads/image.jpg`;
    const itemPack: any = await this.packRepository.findOneBy({ id });
    if (!itemPack) {
      throw new NotFoundException('Pack not found');
    }
    const GetPackParams = {
      nameplan: nameplan,
      trialdays: trialdays,
      description: description,
      features: features,
      timedays: timedays,
      cost: cost,
      code: code,
      status: status,
      createdAt: new Date(),
      finishAt: futureDate,
      image: imagePath,
    };
    // Apply partial updates from GetSupplierParams
    Object.assign(itemPack, GetPackParams);
    return this.packRepository.save(itemPack as Pack);
  }
  /*****************  end of block function to put a class by Id ***********************/
  /*** function to get all packs ************************************/
  async findAllPacks(page = 1, limit = 20) {
    console.log('Estoy en pack.service - line 114 - findAllPacks');
    const [packs, total] = await this.packRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });
    if (total > 0) {
      console.log(
        'Estoy en pack.service - line 121 - listAllPacks: ',
        packs[0].nameplan,
      );
      console.log('Estoy en pack.service - line 124 - total: ' + total);
      return { packs, total };
    }
    console.log('Estoy en pack.service - line 127 - total: ' + total);
    if (total == 0) {
      const Packs = {};
      console.log('Estoy en pack.service - line 130 - total: ', total);
      return { packs: Packs, total };
    }
  }
  /***** End of function to get all Packs *******************************/
  /*****************  function to get a Pack by Id ***********************/
  async findPackById(id: string) {
    const packById: any = await this.packRepository.findOne({
      where: { id },
    });
    console.log(
      'Estoy en packService - line 141 - packById.nameplan: ',
      packById.nameplan,
    );
    console.log(
      'Estoy en packService - line 144 - packById.image: ' + packById.image,
    );
    if (!packById) {
      throw new NotFoundException('Pack not found');
    }
    return packById;
  }

  /*********************** end of function to get a Pack by Id  *********/
  /**** function to erase image in upload dir */
  deleteImagePack(image: string) {
    //const Image = image;
    const Image: string = path.basename(image);
    //const filePath = Image;
    const filePath = path.join(__dirname, '../../uploads', Image);
    console.log(
      'Estoy en pack.service.ts - line 159 - deleteImagepack - image: ',
      filePath,
    );
    fs.unlink(filePath, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.log(
            'Estoy en pack.service.ts - line 166 - deleteImagePack - File not found ',
          );
          const message: string = 'File not found';
          return message;
        }
        const message: string = 'Error deleting file';
        return message;
      }
      /*console.log(
          'Estoy en pack.service.ts - line 113 - deleteImagepack - File deleted successfully ');*/
      const message: string = 'File deleted successfully';
      return message;
    });
  }
  /**** End of block to erase image in upload dir *************************************/
  /**** funtion to delete a pack *******************************************************/
  async deletePack(id: string) {
    const deletedPack: any = await this.packRepository.delete(id);
    console.log(
      'Estoy en pack.service.ts - line 185 - deletePack : ',
      deletedPack,
    );
    if (!deletedPack) {
      const message: string = 'Class not found ..';
      console.log(
        'Estoy en pack.service.ts - line 191 - deletePack - message : ',
        message,
      );
      return message;
    }
    const message: string = 'Class Deleted Successfully ..';
    console.log(
      'Estoy en pack.service.ts - line 198 - deletePack - message : ',
      message,
    );
    return message;
  }

  /***** End of Block to funtion to delete a class **************************************/
  /*****************  function to get a Pack by Code ***********************/
  async findPackByCode(code: string) {
    const packByCode: any = await this.packRepository.findOne({
      where: { code: code },
    });
    console.log(
      'Estoy en packService - line 211 - packByCode.nameplan: ',
      packByCode.nameplan,
    );
    console.log(
      'Estoy en packService - line 215 - packByCode.image: ',
      packByCode.image,
    );
    if (!packByCode) {
      throw new NotFoundException('Pack not found');
    }
    return packByCode as Pack;
  }

  /*********************** end of function to get a Pack by Code  *********/
}
