import { ApiProperty} from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export type ClassType<T = any> = new (...args: any[]) => T;
export function CredentialDto<T extends ClassType>(classRef: T): any {
  class CredentialAuth extends classRef {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    username: string;
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    password: string;
  }
  return CredentialAuth;
}
export function CreateUserDto<T extends ClassType>(classRef: T): any {
  class CreateUserDto extends classRef {}
  return CreateUserDto;
}
