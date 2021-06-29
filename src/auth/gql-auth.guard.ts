import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { AuthTokenService } from './auth-token.service';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  constructor(private tokenService: AuthTokenService) {
    super();
  }
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
  async canActivate(context: ExecutionContext):Promise<any>{
    const ctx = GqlExecutionContext.create(context);
    const { headers } = ctx.getContext().req;
    const payload = headers.authorization.split(' ')[1];
    const check = await this.tokenService.verifyToken(payload);
    if(!check) throw new UnauthorizedException();
    return super.canActivate(context);
  }
}
