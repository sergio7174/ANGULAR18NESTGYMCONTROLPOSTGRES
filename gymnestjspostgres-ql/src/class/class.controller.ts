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
import { ClassService } from './class.service';

@Controller('class')
export class ClassController {
  constructor(private readonly classesService: ClassService) {}
  /*** function to create class document */
  @Post('createClass')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  async createClass(
    @Res() res: Response,
    @Body('classname') classname: string,
    @Body('code') code: string,
    @Body('classday') classday: string,
    @Body('classtime') classtime: string,
    @Body('classlevel') classlevel: string,
    @Body('dateBegin') dateBegin: Date,
    @Body('session_time') session_time: number,
    @Body('price') price: number,
    @Body('trainer') trainer: string,
    @Body('key_benefits') key_benefits: string,
    @Body('expert_trainer') expert_trainer: string,
    @Body('class_overview') class_overview: string,
    @Body('why_matters') why_matters: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(
      'Im at classes.controller.ts - line 46 - go to classesService.createClass',
    );
    const NewClass: any = await this.classesService.createClass(
      classname,
      code,
      classday,
      classtime,
      classlevel,
      dateBegin,
      session_time,
      price,
      trainer,
      key_benefits,
      expert_trainer,
      class_overview,
      why_matters,
      file,
    );
    if (NewClass) {
      return res
        .status(200)
        .send({ NewClass: NewClass , message: 'Class Created Successfully ..'})}
    if (!NewClass) {
      res.status(200).send({ message: 'Class Not updated successfully' });
    }
  }
  /*** the endpoint has to have a name */
  /**** function to get all classes ******************************** */
  @Get('listAll')
  async listAll(
    @Req()
    req: Request,
    @Res() res: Response,
  ) {
    console.log('Im at classes.controller.ts - line 80');
    const classes: any = (await this.classesService.findAllClasses());
    console.log(
      'Im at classes.controller.ts - line 83 - classes.length: ',
      classes.total,
    );
    return res.status(200).send({
      message: 'All Classes fetched successfully',
      total: classes.total,
      classes:classes.classes,
      data:classes.classes // for RTQ-Query format handle data to frontend
 })
  }
  /**** end of function to get all classes ******************************** */
  /*********** function to get a class by id ********************************/
  @Get('get-single-Class/:id')
  async getClassById(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    console.log(
      'Im at classes.controller.ts - line 102 - get-single-Class/:id ',
    );
    const klass: any = await this.classesService.findClassById(id);
    return res
      .status(200)
      .send({ message: 'Single Class Fetched Successfully', clase: klass });
  }
  /*********** end of function to get a class by id ***************************/
  /***** update-class function ************************************* */
  @Put('update-classes/:id')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  async updateClass(
    @Param('id') id: string,
    @Res() res: Response,
    @Body('classname') classname: string,
    @Body('code') code: string,
    @Body('classday') classday: string,
    @Body('classtime') classtime: string,
    @Body('classlevel') classlevel: string,
    @Body('dateBegin') dateBegin: Date,
    @Body('session_time') session_time: number,
    @Body('price') price: number,
    @Body('trainer') trainer: string,
    @Body('key_benefits') key_benefits: string,
    @Body('expert_trainer') expert_trainer: string,
    @Body('class_overview') class_overview: string,
    @Body('why_matters') why_matters: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(
      'Im at classes.controller.ts - line 132 - update-classes/:id ',
      id,
    );
    const updatedClass: any = await this.classesService.updateClass(
      id,
      classname,
      code,
      classday,
      classtime,
      classlevel,
      dateBegin,
      session_time,
      price,
      trainer,
      key_benefits,
      expert_trainer,
      class_overview,
      why_matters,
      file,
    );
    return res
      .status(200)
      .send({ message: 'Class updated successfully', updatedClass });
  }
  /**** End of update class function ******************************** */
  /*** Delete image function *******/
  @Post('delete-image')
  deleteImageClass(@Res() res: Response, @Body('image') image: string) {
    console.log('Im at class.controller.ts - line 161 - delete-image');
    const ImageDeleted: any = this.classesService.deleteImageClass(image);
    return res.status(200).json({ message: ImageDeleted });
  }
  /*** End of  Delete image function **********************************/
  /*********** Delete class function  *********************************/
  @Delete('delete-class/:id')
  async deleteClass(@Param('id') id: string, @Res() res: Response) {
    const deletedClass: any = await this.classesService.deleteClass(id);
    console.log(
      'Estoy en classes.controller.ts - line 170 - deleteClass.message : ',
      deletedClass,
    );
    return res.status(200).json({ message: deletedClass });
  }
  /******************** End of Delete class function block **************/
}
