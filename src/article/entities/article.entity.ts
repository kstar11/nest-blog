import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from '@/user/entities/user.entity';
import { Category } from '@/category/entities/category.entity';
import { Tag } from '@/category/entities/tag.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '文章标题'
  })
  title: string;

  @Column({
    comment: '文章简述',
    length: 100
  })
  description: string;

  @Column({
    comment: '文章内容',
    type: 'text'
  })
  content: string;

  @Column({
    comment: '浏览次数',
    default: 0
  })
  viewCount: number;

  @Column({
    comment: '点赞数量',
    default: 0
  })
  favorCount: number;

  @ManyToOne(() => User, (user) => user.username)
  user: User;

  @ManyToOne(() => Category, (category) => category.name)
  category: Category;

  @ManyToMany(() => Tag, (tag) => tag.name)
  @JoinTable({
    name: 'article_tag'
  })
  tags: Tag[];

  @CreateDateColumn({
    comment: '创建时间'
  })
  createTime: Date;

  @UpdateDateColumn({
    comment: '更新时间'
  })
  updateTime: Date;
}
