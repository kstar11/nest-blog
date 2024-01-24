import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from 'winston';
import { Category } from '@/category/entities/category.entity';
import { Tag } from '@/category/entities/tag.entity';
import { CreateCategoryDto } from '@/category/dto/create-category.dto';
import { UpdateCategoryDto } from '@/category/dto/update-category.dto';
import { CreateTagDto } from '@/category/dto/create-tag.dto';

@Injectable()
export class CategoryService {
  @InjectRepository(Category)
  private categoryRepository: Repository<Category>;

  @InjectRepository(Tag)
  private tagRepository: Repository<Tag>;

  private logger = new Logger();

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryRepository.findOneBy({
      name: createCategoryDto.name
    });

    if (category) {
      throw new BadRequestException('重复的类型名称!');
    }

    try {
      await this.categoryRepository.insert(createCategoryDto);
      return '新增成功';
    } catch (e) {
      this.logger.log(e, CategoryService);
      return '新增失败';
    }
  }

  async createTag(createTagDto: CreateTagDto) {
    const category = await this.tagRepository.findOneBy({
      name: createTagDto.name
    });

    if (category) {
      throw new BadRequestException('重复的类型名称!');
    }

    try {
      await this.tagRepository.insert(createTagDto);
      return '新增成功';
    } catch (e) {
      this.logger.log(e, CategoryService);
      return '新增失败';
    }
  }

  findAll() {
    return `This action returns all category`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} ${JSON.stringify(updateCategoryDto)} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
