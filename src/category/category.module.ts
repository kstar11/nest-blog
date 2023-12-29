import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '@/category/entities/category.entity';
import { Tag } from '@/category/entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Tag])],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule {}
