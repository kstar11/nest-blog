import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsPhoneNumber, MinLength } from 'class-validator';
export class RegisterUserDto {
  @IsNotEmpty({
    message: '用户名不能为空!'
  })
  @ApiProperty()
  username: string;

  @IsNotEmpty({
    message: '昵称不能为空!'
  })
  @ApiProperty()
  nickName: string;

  @IsNotEmpty({
    message: '密码不能为空!'
  })
  @MinLength(6, {
    message: '密码长度不能少于6位!'
  })
  @ApiProperty()
  password: string;

  @IsNotEmpty({
    message: '邮箱不能为空!'
  })
  @IsEmail(
    {},
    {
      message: '不是合法的邮箱格式!'
    }
  )
  @ApiProperty()
  email: string;

  @IsNotEmpty({
    message: '手机号码不能为空!'
  })
  @IsPhoneNumber('CN', {
    message: '不是合法的手机号码!'
  })
  @ApiProperty()
  phoneNumber: string;

  @IsNotEmpty({
    message: '验证码不能为空'
  })
  @ApiProperty()
  captcha: string;
}
