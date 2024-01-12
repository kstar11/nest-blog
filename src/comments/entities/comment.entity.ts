import { User } from '@/user/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '留言内容'
  })
  content: string;

  @Column()
  articleId: number;

  @Column({
    default: 0
  })
  parentId: number;

  @Column({
    default: 0
  })
  favorCount: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @CreateDateColumn({
    comment: '创建时间'
  })
  createTime: Date;

  @UpdateDateColumn({
    comment: '更新时间'
  })
  updateTime: Date;
}
