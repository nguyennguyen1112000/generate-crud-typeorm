import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ClassType, CredentialDto } from './dto/create-auth.dto';
import { Auth } from './entities/auth.entity';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GetUser } from './user.decorator';

export function AuthController<
  T extends ClassType,
  H extends Auth,
  C extends ClassType
>(baseType: T, CreateUserDto: C): any {
  const CredentialAuth = CredentialDto(baseType);
  type CredentialAuth = InstanceType<typeof CredentialAuth>;
  type CreateUserDto = InstanceType<typeof CredentialAuth>;
  @Controller()
  abstract class AuthController {
    constructor(private readonly authService: AuthService<H>) {}
    @Post('/signUp')
    async signUp(@Body() createUserDto: CreateUserDto): Promise<H> {
      return this.authService.createUser(createUserDto);
    }
    @Post('/signIn')
    async signIn(
      @GetUser() user: any,
      @Body() credentialAuth: CredentialAuth,
    ): Promise<{ access_token: string }> {
      return this.authService.login(credentialAuth);
    }
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiBearerAuth('JWT-auth')
    getProfile(@GetUser() user: any) {
      return user;
    }
  }
  return AuthController;
}
