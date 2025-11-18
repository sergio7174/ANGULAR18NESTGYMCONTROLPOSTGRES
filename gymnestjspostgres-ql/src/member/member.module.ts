import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { Member } from './entities/member.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
/*** import multer module */
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]),
    MulterModule.register({ dest: './uploads' }),
  ],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
