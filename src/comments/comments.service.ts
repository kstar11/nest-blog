import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Logger } from 'winston';
import { Comment } from '@/comments/entities/comment.entity';
import { User } from '@/user/entities/user.entity';
import { Article } from '@/article/entities/article.entity';

import { CreateCommentDto } from '@/comments/dto/create-comment.dto';
import { CommentListVo } from '@/comments/vo/comment.list.vo';
import { arrayToTree } from '@/utils';

@Injectable()
export class CommentsService {
  @InjectRepository(Comment)
  private commentRepository: Repository<Comment>;

  @InjectEntityManager()
  private entityManager: EntityManager;

  private logger = new Logger();

  async create(createCommentDto: CreateCommentDto, userId: number, articleId: number) {
    const user = await this.entityManager.findOneBy(User, {
      id: userId
    });

    if (!user) {
      throw new BadRequestException('用户不存在!');
    }

    const article = await this.entityManager.findOneBy(Article, {
      id: articleId
    });

    if (!article) {
      throw new BadRequestException('文章不存在!');
    }

    const newComment = new Comment();
    Object.assign(newComment, createCommentDto, { user: user, articleId: articleId });

    try {
      await this.commentRepository.insert(newComment);
      return '评论成功!';
    } catch (e) {
      this.logger.log(e, CommentsService);
      return '评论失败!';
    }
  }

  async findAll(articleId: number) {
    const article = await this.entityManager.findOneBy(Article, {
      id: articleId
    });

    if (!article) {
      throw new BadRequestException('文章不存在!');
    }

    const [comments, totalCount] = await this.commentRepository.findAndCount({
      select: {
        id: true,
        content: true,
        parentId: true,
        createTime: true,
        updateTime: true,
        user: {
          id: true,
          username: true,
          nickName: true,
          avatar: true
        }
      },
      where: {
        articleId: articleId
      },
      relations: {
        user: true
      }
    });

    try {
      const vo = new CommentListVo();

      const commentsTree = arrayToTree(comments, 'id', 'parentId');

      Object.assign(vo, { comments: commentsTree, totalCount });

      return vo;
    } catch (e) {
      this.logger.log(e, CommentsService);
      throw new BadRequestException(e.message);
    }
  }

  async update(id: number) {
    const comment = await this.commentRepository.findOneBy({
      id
    });

    if (!comment) {
      throw new BadRequestException('评论不存在或已删除!');
    }

    try {
      comment.favorCount += 1;
      await this.commentRepository.save(comment);
      return '点赞完成!';
    } catch (e) {
      this.logger.log(e, CommentsService);
      throw new BadRequestException(e.message);
    }
  }

  async remove(id: number) {
    try {
      await this.commentRepository.delete({
        id
      });
      return '删除成功!';
    } catch (e) {
      this.logger.log(e, CommentsService);
      throw new BadRequestException(e.message);
    }
  }
}
