import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VacancyModule } from './vacancy/vacancy.module';
import { ApplicationsModule } from './applications/applications.module';
import { SeedersModule } from './seeders/seeders.module';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),DatabaseModule, AuthModule, UsersModule, VacancyModule, ApplicationsModule, SeedersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
