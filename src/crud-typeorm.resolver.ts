import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BaseEntity } from './entities/base.entity';
import { CrudTypeormService } from './crud-typeorm.service';
import { InputDto } from './dto';
import { ClassType } from 'type-graphql';
export function CrudTypeormResolver<
  T extends ClassType,
  H extends BaseEntity
>(baseType: T): any {
  const BaseInput = InputDto(baseType);
  type BaseInput = InstanceType<typeof BaseInput>;
  @Resolver({ isAbstract: true })
  abstract class BaseResolverHost {
    constructor(private readonly crudTypeormService: CrudTypeormService<H>) {}
    @Query((type) => [baseType], { name: `findAll${baseType.name}` })
    async findAll(): Promise<H[]> {
      return this.crudTypeormService.findAll();
    }
    @Query((type) => baseType, { name: `findOne${baseType.name}` })
    async findOne(@Args('id') id: number): Promise<H> {
      return this.crudTypeormService.findOne(id);
    }
    @Mutation((type) => baseType, { name: `delete${baseType.name}` })
    async delete(@Args('id') id: number): Promise<H> {
      return this.crudTypeormService.remove(id);
    }
    @Mutation((type) => baseType, { name: `create${baseType.name}` })
    async create(@Args('dto') dto: BaseInput) {
      return this.crudTypeormService.createOne(dto);
    }
    @Mutation((type) => baseType, { name: `update${baseType.name}` })
    async update(@Args('id') id: number, @Args('dto') dto: BaseInput) {
      return this.crudTypeormService.update(id, dto);
    }
  }
  return BaseResolverHost;
}
