import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Patch,
  Param,
} from '@nestjs/common';
import { ClassType } from './auth/dto/create-auth.dto';
import { CrudTypeormService } from './crud-typeorm.service';
import { CreateDto } from './dto';
import { BaseEntity } from './entities/base.entity';

export function CrudTypeormController<
  T extends ClassType,
  H extends BaseEntity,
  C extends ClassType
>(baseType: T, InputDto: C): any {
  const CredentialAuth = CreateDto(baseType);
  type CredentialAuth = InstanceType<typeof CredentialAuth>;
  type InputDto = InstanceType<typeof CredentialAuth>;
  @Controller()
  abstract class CrudTypeormController {
    constructor(private readonly crudTypeormService: CrudTypeormService<H>) {}
    @Get()
    findAll(): Promise<H[]> {
      return this.crudTypeormService.findAll();
    }
    @Get('/:id')
    findOne(@Param('id') id: number): Promise<H> {
      return this.crudTypeormService.findOne(+id);
    }
    @Post()
    createOne(@Body() dto: InputDto) {
      return this.crudTypeormService.createOne(dto);
    }
    @Delete('/:id')
    delete(@Param('id') id: number) {
      return this.crudTypeormService.remove(id);
    }
    @Patch('/:id')
    updateOne(@Param('id') id: number, @Body() dto: InputDto): Promise<H> {
      return this.crudTypeormService.update(id, dto);
    }
  }
  return CrudTypeormController;
}
