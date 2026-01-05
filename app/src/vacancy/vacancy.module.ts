import { Module } from '@nestjs/common';
import { VacanciesService } from './vacancy.service';
import { VacanciesController } from './vacancy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacancy } from './entities/vacancy.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vacancy]), AuthModule],
  controllers: [VacanciesController],
  providers: [VacanciesService],
  exports: [VacanciesService]
})
export class VacancyModule {}
