import { Tag } from '@/category/entities/tag.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty()
  @IsNotEmpty({
    message: '文章标题不能为空'
  })
  title: string;

  @ApiProperty()
  @IsNotEmpty({
    message: '文章简述不能为空'
  })
  description: string;

  @ApiProperty()
  @IsNotEmpty({
    message: '文章内容不能为空'
  })
  content: string;

  @ApiProperty({
    default: 1
  })
  categoryId: number;

  @ApiProperty()
  tags: Tag[];
}
