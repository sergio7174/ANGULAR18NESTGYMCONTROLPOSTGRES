// src/category/category.controller.ts
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
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  /*** function to create category document */
  @Post('')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  async createcategory(
    @Res() res: Response,
    @Body('name') name: string,
    @Body('description') description: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(
      'Im at category.controller.ts - line 35 - go to categoryService.createcategory',
    );
    const Newcategory: any = await this.categoryService.createcategory( 
      name,
      description,
      file,
    );
    if (Newcategory) {
      const CreatedCategory: any = Newcategory.newcategory;
      return res.status(200).send({
        Newcategory: CreatedCategory as Category,
        message: 'category Created Successfully ..',
      });
    }
    if (!Newcategory) {
      res.status(200).send({ message: 'category Not updated successfully' });
    }
  }
  /*** End of the block to create a new category ********************** */
  /**** function to get all categoryes ******************************** */

  @Get('listAll')
  async listAllCategories(@Req() req: Request, @Res() res: Response) {
    console.log('Im at category.controller.ts - line 56');
    const categories: any = await this.categoryService.listAllCategories();
    if (categories.total > 0) {
      console.log(
        'Im at categories.controller.ts - line 62 - categories.total: ',
        categories.total
      );
      console.log(
        'Im at categories.controller.ts - line 66 - categories.categories[0].name: ',
        categories.categories,
      );
      return res.status(200).send({
        message: 'All Categories fetched successfully',
        total: categories.total,
        Categories: categories.categories,
      });
    }
    const cero: number = 0;
    const CategoriesFeched = {};
    return res.status(200).send({
      message:
        'Not Categories fetched.. File Maybe Empty, Add Category Data ..',
      total: cero,
      Categories: CategoriesFeched,
    });
  }
  /**** end of function to get all categories *********************************/
  /*********** function to get a category by id ********************************/
  @Get('get-single-category/:id')
  async findCategoryById(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    console.log(
      'Im at category.controller.ts - line 81 - get-single-Category/:id ' + id,
    );
    const category: any = await this.categoryService.findCategoryById(id);
    return res.status(200).send({
      message: 'Single Category Fetched Successfully',
      category: category as Category,
    });
  }
  /*********** end of function to get a class by id ***************************/
  /***** update-category function ************************************* */
  @Put('update-category/:id')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  updateCategory(
    @Param('id') id: string,
    @Res() res: Response,
    @Body('name') name: string,
    @Body('description') description: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(
      'Im at category.controller.ts - line 100 - update-category/:id ' + id,
    );
    const updatedCategory: any = this.categoryService.updateCategory(
      id,
      name,
      description,
      file,
    );
    return res
      .status(200)
      .send({ message: 'Category updated successfully', updatedCategory });
  }
  /**** End of update category function ******************************** */
  /*** Delete image function *******/
  @Post('delete-image')
  deleteImageCategory(@Res() res: Response, @Body('image') image: string) {
    const ImageDeleted: any = this.categoryService.deleteImageCategory(image);
    console.log(
      'Estoy en category.controller.ts - line 124 - ImageDeleted : ',
      ImageDeleted,
    );
    return res.status(200).send({ message: ImageDeleted as string });
  }
  /*** End of  Delete image function **********************************/
  /*********** Delete category function  *********************************/
  @Delete('delete-category/:id')
  async deleteCategory(@Param('id') id: string, @Res() res: Response) {
    const deletedCategory: any = await this.categoryService.deleteCategory(id);
    console.log(
      'Estoy en category.controller.ts - line 130 - deleteCategory message : ' +
        deletedCategory,
    );
    return res.status(200).json({ message: deletedCategory as string });
  }
  /******************** End of Delete category function block **************/
}
