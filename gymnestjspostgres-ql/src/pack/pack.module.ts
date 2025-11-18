import { Module } from '@nestjs/common';
import { PackService } from './pack.service';
import { PackController } from './pack.controller';
import { Pack } from './entities/pack.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
/*** import multer module */
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pack]),
    MulterModule.register({ dest: './uploads' }),
  ],
  controllers: [PackController],
  providers: [PackService],
})
export class PackModule {}
