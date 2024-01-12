import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/user/vo/uset-list.vo';

export class CommentVo {
  @ApiProperty()
  id: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  parentId: number;

  @ApiProperty()
  createTime: Date;

  @ApiProperty()
  updateTime: Date;

  @ApiProperty()
  user: User;
}

export class CommentListVo {
  @ApiProperty({
    type: [CommentVo]
  })
  comments: CommentVo[];

  @ApiProperty()
  totalCount: number;
}
