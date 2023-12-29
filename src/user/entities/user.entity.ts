import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '用户名'
  })
  username: string;
  @Column({
    length: 50,
    comment: '密码'
  })
  password: string;

  @Column({
    name: 'nick_name',
    length: 50,
    comment: '昵称'
  })
  nickName: string;

  @Column({
    comment: '邮箱',
    length: 50
  })
  email: string;

  @Column({
    comment: '头像',
    length: 100,
    nullable: true
  })
  avatar: string;

  @Column({
    comment: '是否冻结',
    default: false
  })
  isFrozen: boolean;

  @Column({
    comment: '手机号',
    length: 20,
    nullable: true
  })
  phoneNumber: string;

  @CreateDateColumn({
    comment: '创建时间',
    select: false
  })
  createTime: Date;

  @UpdateDateColumn({
    comment: '更新时间',
    select: false
  })
  updateTime: Date;
}
