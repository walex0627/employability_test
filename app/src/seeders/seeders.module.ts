import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeders.service';
import { User } from '../users/entities/user.entity';
import { Vacancy } from '../vacancy/entities/vacancy.entity';
import { Application } from '../applications/entities/application.entity';

@Module({
  imports: [

    TypeOrmModule.forFeature([User, Vacancy, Application]),
  ],
  providers: [SeederService],
  exports: [SeederService], 
})
export class SeedersModule {}