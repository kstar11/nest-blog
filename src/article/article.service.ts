import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from '@/article/entities/article.entity';
import { CreateArticleDto } from '@/article/dto/create-article.dto';
import { UpdateArticleDto } from '@/article/dto/update-article.dto';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleService {
  @InjectRepository(Article)
  private articleRepository: Repository<Article>;

  create(createArticleDto: CreateArticleDto) {
    return 'This action adds a new article';
  }

  async findAll() {
    return await this.articleRepository.find({
      relations: {
        category: true,
        tags: true,
        user: true
      }
    });
    // const [articles, totalCount] = await this.articleRepository.findAndCount({
    //   relations: {
    //     categorys: true,
    //     comments: true,
    //     tags: true,
    //     user: true
    //   }
    // });
    // return {
    //   articles,
    //   totalCount
    // };
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
