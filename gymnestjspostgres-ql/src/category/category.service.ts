import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
/*** imports to handle image on backend server */
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';
import { SERVER_URL } from 'src/config/constants';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private configService: ConfigService,
  ) {}
/****function to create a category document ****************************/
  async createcategory(
    name: string,
    description: string,
    file: Express.Multer.File,
  ) {
    console.log('Im at category.services.ts - line 25 - createcategory');
    const imagePath = file
      ? `/uploads/${file.filename}`
      : `${SERVER_URL}/uploads/image.jpg`;
    const GetCategoryParams = {
      name: name,
      description: description,
      createdAt: new Date(),
      image: imagePath,
    };

    const newCategory: any =
      await this.categoryRepository.save(GetCategoryParams);

    return newCategory as Category;
  }
  /**** end of the block to create a category document *******************/
  /*****************  function to put(update) a category by Id ***********************/
  async updateCategory(
    id: string,
    name: string,
    description: string,
    file: Express.Multer.File,
  ) {
    console.log('category.service - line 49 - SERVER_URL: ' + SERVER_URL);
    const imagePath = file
      ? `/uploads/${file.filename}`
      : `${SERVER_URL}/uploads/image.jpg`;
    const itemCategory: any = await this.categoryRepository.findOneBy({ id });

    if (!itemCategory) {
      throw new NotFoundException('Category not found');
    }
    const GetCategoryParams = {
      name: name,
      description: description,
      image: imagePath,
    };

    // Apply partial updates from GetSupplierParams
    Object.assign(itemCategory, GetCategoryParams);
    return this.categoryRepository.save(itemCategory as Category);
  }
  /*****************  end of block function to put a category by Id ********************/
  /*** function to get all categories ************************************/
  async listAllCategories(page = 1, limit = 20) {
    console.log('Estoy en Category.service - line 60 - listAllCategories');
    const [categories, total] = await this.categoryRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });
    if (total > 0) {
      console.log(
        'Estoy en category.service - line 66 - listAllCategories: ' +
          categories[0].name,
      );
      console.log('Estoy en category.service - line 70 - total: ' + total);
      return { categories, total };
    }
    console.log('Estoy en category.service - line 73 - total: ' + total);
    if (total == 0) {
      const Categories = {};
      console.log('Estoy en category.service - line 76 - total: ', total);
      return { categories: Categories, total };
    }
  }
  /***** End of function to get all Categories *******************************/
  /*****************  function to get a category by Id ***********************/
  async findCategoryById(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    console.log(
      'Estoy en category.Service - line 86 - findCategoryById: ',
      category,
    );
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  /*********************** end of function to get a category by Id  *********/
  /**** function to erase image in upload dir */
  deleteImageCategory(image: string) {
    const Image: string = path.basename(image);
    const filePath = path.join(__dirname, '../../uploads', Image);
    console.log(
      'Estoy en category.service.ts - line 101 - deleteImageCategory - image: ',
      filePath,
    );
    fs.unlink(filePath, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.log(
            'Estoy en category.service.ts - line 108 - deleteImageCategory - File not found ',
          );
          const message: string = 'File not found';
          return message;
        }
        const message: string = 'Error deleting file';
        return message;
      }
      console.log(
        'Estoy en category.service.ts - line 117 - deleteImageCategory - File deleted successfully ',
      );
      const message: string = 'File deleted successfully';
      return message;
    });
  }
  /**** End of block to erase image in upload dir ******************************************/
  /**** funtion to delete a category *******************************************************/
  async deleteCategory(id: string) {
    const deletedCategory = await this.categoryRepository.delete(id);
    console.log(
      'Estoy en category.service.ts - line 128 - deleteCategory : ',
      deletedCategory,
    );
    if (!deletedCategory) {
      const message: string = 'Category not found ..';
      console.log(
        'Estoy en category.service.ts - line 134 - deleteCategory - message : ',
        message,
      );
      return message;
    }
    const message: string = 'Category Deleted Successfully ..';
    console.log(
      'Estoy en category.service.ts - line 141 - deleteCategory - message : ',
      message,
    );
    return message;
  }
  /***** End of Block to funtion to delete a category ***********************************/
}
