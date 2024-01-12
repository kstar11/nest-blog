import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Like, Repository } from 'typeorm';
import { Logger } from 'winston';
import { Article } from '@/article/entities/article.entity';
import { Category } from '@/category/entities/category.entity';
import { CreateArticleDto } from '@/article/dto/create-article.dto';
import { UpdateArticleDto } from '@/article/dto/update-article.dto';
import { User } from '@/user/entities/user.entity';
import { Tag } from '@/category/entities/tag.entity';

@Injectable()
export class ArticleService {
  @InjectRepository(Article)
  private articleRepository: Repository<Article>;

  @InjectEntityManager()
  private entityManager: EntityManager;

  private logger = new Logger();

  async create(createArticleDto: CreateArticleDto, userId: number) {
    const category = await this.entityManager.findOneBy(Category, {
      id: createArticleDto.categoryId
    });

    if (!category) {
      throw new BadRequestException('错误的文章分类');
    }

    const user = await this.entityManager.findOneBy(User, {
      id: userId
    });

    const newArticle = new Article();
    Object.assign(newArticle, createArticleDto, { user, category });

    if (createArticleDto.tags) {
      const tags = await this.entityManager.findBy(Tag, createArticleDto.tags);
      Object.assign(newArticle, { tags });
    }

    try {
      await this.articleRepository.save(newArticle);
      return '添加成功!';
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findAll(pageNo: number, pageSize: number, title: string, categoryId: number) {
    const skipCount = (pageNo - 1) * pageSize;

    const condition: Record<string, any> = {};

    if (title) {
      condition.title = Like(`%${title}%`);
    }

    if (categoryId) {
      condition.category = { id: categoryId };
    }

    const [articles, totalCount] = await this.articleRepository.findAndCount({
      select: {
        id: true,
        title: true,
        description: true,
        createTime: true,
        user: {
          id: true,
          username: true,
          nickName: true,
          avatar: true
        }
      },
      take: pageSize,
      skip: skipCount,
      where: condition,
      relations: {
        category: true,
        tags: true,
        user: true
      },
      order: {
        createTime: 'DESC'
      }
    });
    return {
      articles,
      totalCount
    };
  }

  async findOne(id: number) {
    const article = await this.articleRepository.findOne({
      where: { id },
      select: {
        user: {
          id: true,
          username: true,
          nickName: true,
          avatar: true
        }
      },
      relations: {
        category: true,
        tags: true,
        user: true
      }
    });
    if (!article) {
      throw new BadRequestException('文章不存在!');
    }

    article.viewCount += 1;

    this.articleRepository.save(article);

    return article;
  }

  async favoriteArticle(id: number) {
    const article = await this.articleRepository.findOneBy({ id });

    if (!article) {
      throw new BadRequestException('文章不存在!');
    }

    article.favorCount += 1;
    try {
      await this.articleRepository.save(article);
      return '点赞成功';
    } catch (e) {
      throw new BadRequestException('点赞失败!');
    }
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    const article = await this.articleRepository.findOneBy({ id });

    if (!article) {
      throw new BadRequestException('文章不存在!');
    }

    const newArticle = new Article();
    Object.assign(newArticle, article, updateArticleDto);

    try {
      await this.articleRepository.save(newArticle);
      return '更新成功!';
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async remove(id: number) {
    try {
      await this.articleRepository.delete({
        id
      });
      return '删除成功!';
    } catch (e) {
      this.logger.log(e, ArticleService);
      throw new BadRequestException(e.message);
    }
  }
}
