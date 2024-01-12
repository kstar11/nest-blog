import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsNotEmpty({
    message: '内容不能为空'
  })
  content: string;

  @ApiProperty()
  parentId: number;
}
