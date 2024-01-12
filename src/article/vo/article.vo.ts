import { ApiProperty } from '@nestjs/swagger';
import { Category } from '@/category/entities/category.entity';
import { Tag } from '@/category/entities/tag.entity';
import { User } from '@/user/entities/user.entity';

export class Article {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: boolean;

  @ApiProperty()
  content: string;

  @ApiProperty()
  viewCount: number;

  @ApiProperty()
  favorCount: number;

  @ApiProperty()
  createTime: Date;

  @ApiProperty()
  category: Category;

  @ApiProperty()
  tags: Tag[];

  @ApiProperty()
  user: User;
}

export class ArticleListVo {
  @ApiProperty({
    type: [Article]
  })
  articles: ArticleListVo[];

  @ApiProperty()
  totalCount: number;
}
