import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthToken } from './entities/auth-token.entity';
@Injectable()
export class AuthTokenService {
  constructor(
    @InjectRepository(AuthToken)
    private tokenRepository: Repository<AuthToken>,
  ) {}
  async create(access_token: string): Promise<AuthToken> {
    const token = await this.tokenRepository.create({
      access_token,
    });
    await this.tokenRepository.save(token);
    return token;
  }
  async verifyToken(access_token: string): Promise<boolean> {
    const found = await this.tokenRepository.findOne({
      where: { access_token },
    });
    return found !== undefined;
  }
  async removeToken(access_token: string): Promise<void> {
    const token = await this.tokenRepository.findOne({
      where: { access_token },
    });
    try {
      await this.tokenRepository.remove(token);
    } catch (err) {
      throw new BadGatewayException('Token is not valid');
    }
  }
}
