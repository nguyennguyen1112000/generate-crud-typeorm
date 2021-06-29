import { Entity, Column, PrimaryGeneratedColumn, } from 'typeorm';
@Entity()
export abstract class AuthToken {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({length:300})
  access_token: string;

}
