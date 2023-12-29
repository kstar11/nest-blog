import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({
    message: '分类名称不能为空'
  })
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}
