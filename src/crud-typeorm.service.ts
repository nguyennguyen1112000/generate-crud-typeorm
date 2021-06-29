import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { CrudBaseService } from './interface/crud-base-service.interface';
@Injectable()
export class CrudTypeormService<T> implements CrudBaseService<T> {
  constructor(private baseRepository: Repository<T>) {}
  async findAll(): Promise<T[]> {
    return await this.baseRepository.find();
  }
  async createOne(dto: DeepPartial<T>): Promise<T> {
    const entity = await this.baseRepository.create(dto);
    await this.baseRepository.save<any>(entity);
    return entity;
  }
  async findOne(id: number): Promise<T> {
    try {
      const found = await this.baseRepository.findOne({ where: { id } });
      if (!found) {
        throw new NotFoundException(
          `Not found ${this.entityName} with id = ${id}`,
        );
      }
      return found;
    } catch (err) {
      throw new BadRequestException();
    }
  }
  async remove(id: number): Promise<T> {
    try {
      const found = await this.findOne(id);
      await this.baseRepository.remove(found);
      return found;
    } catch (err) {
      throw new BadGatewayException(
        `Can not delete ${this.entityName} with id = ${id}`,
      );
    }
  }
  async update(id: number, dto: DeepPartial<T>): Promise<T> {
    const found = await this.findOne(id);
    const entityProperties = this.baseRepository.metadata.ownColumns.map(
      (column) => column.propertyName,
    );
    Object.getOwnPropertyNames(dto).forEach((element) => {
      if (entityProperties.includes(element)) found[element] = dto[element];
    });
    await this.baseRepository.save<any>(found);
    return found;
  }
  protected get entityName(): string {
    return this.baseRepository.metadata.targetName;
  }
}
