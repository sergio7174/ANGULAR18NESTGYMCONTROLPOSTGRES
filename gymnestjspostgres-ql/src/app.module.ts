// src/app.module.ts
import { Module } from '@nestjs/common';
// for been using .env
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
/*** to handle images uploads */
import { ServeStaticModule } from '@nestjs/serve-static';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { MemberModule } from './member/member.module';
import { PackModule } from './pack/pack.module';
import { StaffModule } from './staff/staff.module';
import { ClassModule } from './class/class.module';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async () => {
        const configService = new ConfigService();
        return {
          type: 'postgres',
          host: configService.get('POSTGRES_HOST'),
          port: configService.get('POSTGRES_PORT'),
          username: configService.get('POSTGRES_USER'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
          migrations: [__dirname + '/migrations/*{.ts,.js}'],
          cli: {
            migrationsDir: 'src/migrations',
          },
        };
      },
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    CategoryModule,
    MemberModule,
    PackModule,
    StaffModule,
    ClassModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
