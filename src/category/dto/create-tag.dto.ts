import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty({
    message: '标签名称不能为空'
  })
  @MaxLength(6)
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}
