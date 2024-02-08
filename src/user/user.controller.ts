import { ConfigService } from '@nestjs/config';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Inject,
  Query,
  DefaultValuePipe,
  HttpCode
} from '@nestjs/common';
import { ApiBody, ApiTags, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery, ApiOperation } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { RequireLogin, UserInfo } from '@/custom.decorator';
import { UserService } from '@/user/user.service';
import { generateParseIntPipe } from '@/utils';
import { RegisterUserDto } from '@/user/dto/register-user.dto';
import { UpdateUserDto } from '@/user/dto/update-user.dto';
import { LoginUserDto } from '@/user/dto/login-user.dto';
import { UpdateUserPasswordDto } from '@/user/dto/update-user-password';
import { User, UserListVo } from '@/user/vo/uset-list.vo';
import { LoginUserVo } from '@/user/vo/login-user.vo';

@ApiTags('用户管理模块')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  @ApiOperation({
    summary: '用户注册',
    description: '用户注册',
    tags: ['用户管理模块']
  })
  @HttpCode(HttpStatus.OK)
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

  @ApiOperation({
    summary: '用户列表',
    description: '用户列表',
    tags: ['用户管理模块']
  })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'pageNo',
    description: '第几页',
    required: false,
    type: Number
  })
  @ApiQuery({
    name: 'pageSize',
    description: '每页多少条',
    required: false,
    type: Number
  })
  @ApiQuery({
    name: 'username',
    description: '用户名',
    required: false,
    type: String
  })
  @ApiQuery({
    name: 'nickName',
    description: '昵称',
    required: false,
    type: String
  })
  @ApiQuery({
    name: 'email',
    description: '邮箱地址',
    required: false,
    type: String
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户列表',
    type: UserListVo
  })
  @RequireLogin()
  @Get('list')
  async userList(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo'))
    pageNo: number,
    @Query('pageSize', new DefaultValuePipe(5), generateParseIntPipe('pageSize'))
    pageSize: number,
    @Query('username') username: string,
    @Query('nickName') nickName: string,
    @Query('email') email: string
  ) {
    return this.userService.findUsersByPage(username, nickName, email, pageNo, pageSize);
  }

  @ApiOperation({
    summary: '用户登录',
    description: '用户登录',
    tags: ['用户管理模块']
  })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户不存在/密码错误',
    type: String
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户信息及token',
    type: LoginUserVo
  })
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

  @ApiOperation({
    summary: '用户详情',
    description: '用户详情',
    tags: ['用户管理模块']
  })
  @ApiParam({
    name: 'id',
    description: '用户Id',
    type: Number
  })
  @ApiResponse({
    type: User,
    description: 'success',
    status: HttpStatus.OK
  })
  @Get('detail/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findUserById(+id);
  }

  @ApiOperation({
    summary: '用户冻结',
    description: '用户冻结',
    tags: ['用户管理模块']
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: '用户Id',
    type: Number
  })
  @ApiResponse({
    type: String,
    description: 'success'
  })
  @RequireLogin()
  @Get('freeze/:id')
  async freeze(@Param('id') userId: number) {
    await this.userService.freezeUserById(userId);
    return 'success';
  }

  @ApiOperation({
    summary: '用户更新',
    description: '用户更新',
    tags: ['用户管理模块']
  })
  @ApiBearerAuth()
  @ApiBody({
    type: UpdateUserDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/不正确'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新成功',
    type: String
  })
  @Patch('update')
  @RequireLogin()
  update(@UserInfo('userId') userId: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(userId, updateUserDto);
  }

  @ApiOperation({
    summary: '用户修改密码',
    description: '用户修改密码',
    tags: ['用户管理模块']
  })
  @ApiBearerAuth()
  @ApiBody({
    type: UpdateUserPasswordDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: String,
    description: '验证码已失效/不正确'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '修改成功',
    type: String
  })
  @Patch('update-pwd')
  @RequireLogin()
  async updatePwd(@UserInfo('userId') userId: number, @Body() passwordDto: UpdateUserPasswordDto) {
    return await this.userService.updatePassword(userId, passwordDto);
  }

  @ApiOperation({
    summary: '用户删除',
    description: '用户删除',
    tags: ['用户管理模块']
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: '删除成功/失败',
    type: String
  })
  @ApiParam({
    name: 'id',
    description: '用户Id',
    type: Number
  })
  @RequireLogin()
  @Delete('delete/:id')
  remove(@Param('id') id: number) {
    return this.userService.remove(+id);
  }
}
