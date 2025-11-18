import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { Staff } from './entities/staff.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
/*** import multer module */
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Staff]),
    MulterModule.register({ dest: './uploads' }),
  ],
  controllers: [StaffController],
  providers: [StaffService],
})
export class StaffModule {}
