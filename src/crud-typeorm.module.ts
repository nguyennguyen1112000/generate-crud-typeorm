import { Module } from '@nestjs/common';
import { CrudTypeormService } from './crud-typeorm.service';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [ AuthModule],
  providers: [CrudTypeormService],
  controllers: [],
  exports: [CrudTypeormService],
})
export class CrudTypeormModule {}
