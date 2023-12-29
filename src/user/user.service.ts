import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from 'winston';
import { md5 } from '@/utils';

import { User } from '@/user/entities/user.entity';
import { RegisterUserDto } from '@/user/dto/register-user.dto';
import { LoginUserDto } from '@/user/dto/login-user.dto';
import { UpdateUserDto } from '@/user/dto/update-user.dto';
import { UserListVo } from '@/user/vo/uset-list.vo';
import { LoginUserVo } from '@/user/vo/login-user.vo';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  private logger = new Logger();

  async register(user: RegisterUserDto) {
    const foundUser = await this.userRepository.findOneBy({
      username: user.username
    });

    if (foundUser) {
      throw new HttpException('用户名已存在!', HttpStatus.BAD_REQUEST);
    }

    const newUser = new User();
    Object.assign(newUser, user, { password: md5(user.password) });

    try {
      await this.userRepository.insert(newUser);
      return '注册成功!';
    } catch (e) {
      this.logger.error(e, UserService);
      return '注册失败!';
    }
  }

  async login(loginUser: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        username: loginUser.username
      }
    });

    if (!user || user.password !== md5(loginUser.password)) {
      throw new HttpException('用户名或密码不正确!', HttpStatus.BAD_REQUEST);
    }
    const userVo = new LoginUserVo();
    userVo.userInfo = {
      id: user.id,
      username: user.username,
      nickName: user.nickName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      avatar: user.avatar,
      isFrozen: user.isFrozen,
      createTime: user.createTime
    };

    return userVo;
  }

  async findAllUsers() {
    const [users, totalCount] = await this.userRepository.findAndCount({
      select: ['id', 'username', 'nickName', 'email', 'phoneNumber', 'avatar', 'createTime']
    });
    const vo = new UserListVo();
    Object.assign(vo, { users, totalCount });
    return vo;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} ${JSON.stringify(updateUserDto)} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
