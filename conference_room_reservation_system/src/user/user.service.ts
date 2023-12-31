import { Injectable,Inject,Logger,HttpException,HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { md5 } from '../../utils/md5';

@Injectable()
export class UserService {
  // 程序日志记录
  private logger = new Logger();

  @InjectRepository(User)
  private userRepository:Repository<User>;

  @Inject(RedisService)
  private redisService: RedisService;

  async register(user:RegisterUserDto) {
    const captcha = await this.redisService.get(`captcha_${user.email}`);

    if(!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if(user.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOneBy({
      username:user.username
    });

    if(foundUser) {
      throw new HttpException('用户已存在',HttpStatus.BAD_REQUEST);
    }

    const newUser = new User();
    newUser.username = user.username;
    newUser.password = md5(user.password);
    newUser.email = user.email;
    newUser.nickName = user.nickName;

    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch(e) {
      this.logger.error(e, UserService);
      return '注册失败';
    }
  }
}
