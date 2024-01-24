import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { UserModule } from '@/user/user.module';
import { ArticleModule } from '@/article/article.module';
import { CategoryModule } from '@/category/category.module';
import { CommentsModule } from '@/comments/comments.module';

import { LoggerModule } from '@/logger/logger.module';
import { LoginGuard } from '@/guards/login.guard';

import { User } from '@/user/entities/user.entity';
import { Article } from '@/article/entities/article.entity';
import { Category } from '@/category/entities/category.entity';
import { Tag } from '@/category/entities/tag.entity';
import { Comment } from '@/comments/entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          type: 'mysql',
          host: configService.get('mysql_server_host'),
          port: configService.get('mysql_server_port'),
          username: configService.get('mysql_server_username'),
          password: configService.get('mysql_server_password'),
          database: configService.get('mysql_server_database'),
          synchronize: true,
          logging: false,
          poolSize: 10,
          connectorPackage: 'mysql2',
          extra: {
            authPlugin: 'sha256_password'
          },
          entities: [User, Article, Category, Tag, Comment]
        };
      },
      inject: [ConfigService]
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/.env'
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('jwt_secret'),
          signOptions: {
            expiresIn: configService.get('jwt_access_token_expires_time')
          }
        };
      },
      inject: [ConfigService]
    }),
    UserModule,
    ArticleModule,
    CategoryModule,
    CommentsModule,
    LoggerModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard
    }
  ]
})
export class AppModule {}
