import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Logger } from 'winston';
import { md5 } from '@/utils';

import { User } from '@/user/entities/user.entity';
import { RegisterUserDto } from '@/user/dto/register-user.dto';
import { LoginUserDto } from '@/user/dto/login-user.dto';
import { UpdateUserDto } from '@/user/dto/update-user.dto';
import { UserListVo } from '@/user/vo/uset-list.vo';
import { LoginUserVo } from '@/user/vo/login-user.vo';
import { UpdateUserPasswordDto } from '@/user/dto/update-user-password';

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

  async findUsersByPage(username: string, nickName: string, email: string, pageNo: number, pageSize: number) {
    const skipCount = (pageNo - 1) * pageSize;

    const condition: Record<string, any> = {};

    if (username) {
      condition.username = Like(`%${username}%`);
    }

    if (nickName) {
      condition.nickName = Like(`%${nickName}%`);
    }

    if (email) {
      condition.email = Like(`%${email}%`);
    }

    const [users, totalCount] = await this.userRepository.findAndCount({
      select: ['id', 'username', 'nickName', 'email', 'phoneNumber', 'avatar', 'createTime'],
      skip: skipCount,
      take: pageSize,
      where: condition
    });
    const vo = new UserListVo();
    Object.assign(vo, { users, totalCount });
    return vo;
  }

  async findUserById(id: number) {
    const user = await this.userRepository.findOne({
      select: {
        id: true,
        username: true,
        nickName: true,
        avatar: true,
        isFrozen: true,
        email: true,
        phoneNumber: true,
        createTime: true,
        updateTime: true
      },
      where: {
        id: id
      },
      relations: ['roles', 'roles.permissions']
    });
    return user;
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    // const captcha = await this.redisService.get(`update_user_captcha_${updateUserDto.email}`);

    // if (!captcha) {
    //   throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    // }

    // if (updateUserDto.captcha !== captcha) {
    //   throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    // }

    const foundUser = await this.userRepository.findOneBy({
      id: userId
    });

    Object.assign(foundUser, updateUserDto);

    try {
      await this.userRepository.save(foundUser);
      return '修改成功';
    } catch (e) {
      this.logger.error(e, UserService);
      return '修改失败';
    }
  }

  async updatePassword(userId: number, passwordDto: UpdateUserPasswordDto) {
    // const captcha = await this.redisService.get(`update_password_captcha_${passwordDto.email}`);

    // if (!captcha) {
    //   throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    // }

    // if (passwordDto.captcha !== captcha) {
    //   throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    // }

    const foundUser = await this.userRepository.findOneBy({
      id: userId
    });

    foundUser.password = md5(passwordDto.password);

    try {
      await this.userRepository.save(foundUser);
      return '密码修改成功';
    } catch (e) {
      this.logger.error(e, UserService);
      return '密码修改失败';
    }
  }

  async freezeUserById(id: number) {
    const user = await this.userRepository.findOneBy({
      id
    });

    user.isFrozen = !user.isFrozen;

    await this.userRepository.save(user);
  }

  async remove(id: number) {
    try {
      await this.userRepository.delete({
        id
      });
      return '删除成功!';
    } catch (e) {
      this.logger.log(e, UserService);
      throw new BadRequestException(e.message);
    }
  }
}
