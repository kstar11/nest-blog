import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleService } from '@/article/article.service';
import { ArticleController } from '@/article/article.controller';
import { Article } from '@/article/entities/article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article])],
  controllers: [ArticleController],
  providers: [ArticleService]
})
export class ArticleModule {}
