import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { ClassType } from './dto/create-auth.dto';
import { Auth } from './entities/auth.entity';
import { InputDto } from '../dto';
import { CredentialGraphqlDto } from './dto/create-auth.graphql.dto ';
import { UserToken } from './entities/user-token';
import { GqlAuthGuard } from './gql-auth.guard';
import { CurrentUser } from './gql-user.decorator';
import { AuthTokenService } from './auth-token.service';
import { JwtToken } from './jwt-token.decorator';
import { UseGuards } from '@nestjs/common';

export function AuthResolver<T extends ClassType, H extends Auth>(
  baseType: T,
): any {
  const CreateUserInput = InputDto(baseType);
  type CreateUserInput = InstanceType<typeof CreateUserInput>;
  const CredentialDto = CredentialGraphqlDto(baseType);
  type CredentialDto = InstanceType<typeof CredentialDto>;
  @Resolver({ isAbstract: true })
  abstract class AuthResolver {
    constructor(
      private readonly authService: AuthService<H>,
      private readonly tokenService: AuthTokenService,
    ) {}
    @Mutation((type) => baseType, { name: `signUp${baseType.name}` })
    async create(@Args('dto') dto: CreateUserInput) {
      return this.authService.createUser(dto);
    }
    @Mutation((type) => UserToken, { name: `signIn${baseType.name}` })
    async login(@Args('dto') dto: CredentialDto): Promise<any> {
      const token= await this.authService.login(dto);
      await this.tokenService.create((await token).access_token);
     return token;
    }
    @UseGuards(GqlAuthGuard)
    @Query((type) => baseType, { name: `profile${baseType.name}` })
    async profile(@CurrentUser() user: any) {
      return this.authService.profile(user);
    }
    @Query((type) => String, { name: `signOut${baseType.name}` })
    async logout(@JwtToken() token): Promise<any> {
      await this.tokenService.removeToken(token);
      return "Logout successful"
    }
  }
  return AuthResolver;
}
