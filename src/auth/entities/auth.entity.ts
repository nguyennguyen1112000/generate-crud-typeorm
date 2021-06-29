import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export abstract class Auth {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @Column()
  password: string;

}
