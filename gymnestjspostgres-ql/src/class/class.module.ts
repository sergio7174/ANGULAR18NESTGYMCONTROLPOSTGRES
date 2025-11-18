import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { Class } from './entities/class.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
/*** import multer module */
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Class]),
    MulterModule.register({ dest: './uploads' }),
  ],
  controllers: [ClassController],
  providers: [ClassService],
})
export class ClassModule {}
