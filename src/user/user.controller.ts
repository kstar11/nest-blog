import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Inject } from '@nestjs/common';
import { ApiBody, ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/user/user.service';
import { RegisterUserDto } from '@/user/dto/register-user.dto';
import { UpdateUserDto } from '@/user/dto/update-user.dto';
import { LoginUserDto } from '@/user/dto/login-user.dto';
import { ConfigService } from '@nestjs/config';
import { RequireLogin } from '@/custom.decorator';

@ApiTags('用户管理模块')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/验证码不正确/用户已存在',
    type: String
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '注册成功/失败',
    type: String
  })
  @Post('register')
  create(@Body() createUserDto: RegisterUserDto) {
    return this.userService.register(createUserDto);
  }

  @RequireLogin()
  @Get('list')
  findAll() {
    return this.userService.findAllUsers();
  }

  @Post('login')
  async login(@Body() loginUser: LoginUserDto) {
    const vo = await await this.userService.login(loginUser);
    vo.accessToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
        username: vo.userInfo.username
      },
      {
        expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m'
      }
    );
    return vo;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
