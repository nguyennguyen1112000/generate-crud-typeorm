import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthBaseService } from './interface/auth.interface';
@Injectable()
export class AuthService<T> implements AuthBaseService<T> {
  private jwtService: JwtService;
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<T>,
  ) {}
  async login(inputDto: any): Promise<any> {
    const { username, password } = inputDto;
    const auth = (await this.authRepository.findOne({
      where: { username },
    })) as any;
    if (auth && (await bcrypt.compare(password as string, auth.password))) {
      const { password, ...payload } = auth;
      this.jwtService = new JwtService({
        secret: jwtConstants.KEY,
        signOptions: { expiresIn: 3600 },
      });
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new UnauthorizedException(`Username or password is not valid`);
  }

  async createUser(createAuthDto: any): Promise<T> {
    const { username, password, ...other } = createAuthDto;
    const found = await this.authRepository.findOne({ where: { username } });
    if (found) {
      throw new ConflictException(`Username ${username} already exists`);
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password as string, salt);
    const user = await this.authRepository.create({
      username,
      password: hash,
      ...other,
    } as DeepPartial<T>);
    await this.authRepository.save<any>(user);
    return user;
  }
  async profile(user: any): Promise<any> {
    const { username } = user;
    const found = (await this.authRepository.findOne({
      where: { username },
    })) as any;
    const { password, ...profile } = found;
    return profile;
  }
}
