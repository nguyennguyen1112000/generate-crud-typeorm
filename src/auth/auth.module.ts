import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { PassportModule } from '@nestjs/passport';
import { GqlAuthGuard } from './gql-auth.guard';
import { AuthTokenService } from './auth-token.service';
import { AuthToken } from './entities/auth-token.entity';
@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([Auth,AuthToken]),
  ],
  controllers: [],
  providers: [AuthService, GqlAuthGuard,AuthTokenService],
  exports: [TypeOrmModule,AuthService, AuthTokenService],
})
export class AuthModule {}
