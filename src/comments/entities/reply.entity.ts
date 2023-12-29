import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Article } from '@/article/entities/article.entity';
import { User } from '@/user/entities/user.entity';
import { Comment } from '@/comments/entities/comment.entity';

@Entity()
export class Reply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '回复内容'
  })
  content: string;

  @Column({
    comment: '回复目标id',
    default: 0
  })
  parentId: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Article, (article) => article.id)
  article: Article;

  @ManyToOne(() => Comment, (comment) => comment.id)
  comment: Comment;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
