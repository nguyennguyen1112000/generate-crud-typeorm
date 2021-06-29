import { DeepPartial } from "typeorm";
export interface CrudBaseService<T> {
  findAll(): Promise<T[]>;
 createOne(dto: DeepPartial<T>): Promise<T>;
  findOne(id: number): Promise<T> ;
  update(id:number, dto:DeepPartial<T>):Promise<T>;
}
