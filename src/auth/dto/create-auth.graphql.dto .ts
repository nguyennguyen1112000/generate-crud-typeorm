import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
export type ClassType<T = any> = new (...args: any[]) => T;
export function CredentialGraphqlDto<T extends ClassType>(classRef: T): any {
  @InputType(`CredentialAuth${classRef.name}`)
  class CredentialAuth extends classRef {
    @Field()
    @IsNotEmpty()
    @IsString()
    username: string;
    @Field()
    @IsNotEmpty()
    @IsString()
    password: string;
  }
  return CredentialAuth;
}
