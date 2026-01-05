import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { Vacancy, Modality } from '../vacancy/entities/vacancy.entity';
import { Application } from '../applications/entities/application.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Vacancy)
    private readonly vacancyRepository: Repository<Vacancy>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}

  async onModuleInit() {
    this.logger.log('Initializing Seeders...');
    await this.seedUsers();
    await this.seedVacancies();
    await this.seedApplications();
    this.logger.log('Seeding Complete.');
  }

  async seedUsers() {

    if ((await this.userRepository.count()) > 0) return;

    const password = await bcrypt.hash('Riwi123!', 10);
    
    await this.userRepository.save([
      { name: 'Super Admin', email: 'admin@riwi.io', password, role: UserRole.ADMIN },
      { name: 'Hiring Manager', email: 'manager@riwi.io', password, role: UserRole.GESTOR },
      { name: 'Junior Coder', email: 'coder@riwi.io', password, role: UserRole.CODER },
    ]);
    this.logger.log('Users created successfully');
  }

  async seedVacancies() {
    if ((await this.vacancyRepository.count()) > 0) return;

    await this.vacancyRepository.save([
      {
        title: 'NestJS Backend Developer',
        description: 'Desarrollador Backend con experiencia en NestJS y TypeORM.',
        technologies: 'NestJS, Docker, PostgreSQL',
        seniority: 'Junior',
        softSkills: 'Responsabilidad',
        location: 'Remoto',
        modality: Modality.REMOTE,
        salaryRange: '3M - 4M',
        company: 'Riwi Tech',
        maxApplicants: 3,
        isActive: true,
      },

    ]);
    this.logger.log('Vacancies created successfully');
  }

  async seedApplications() {
    if ((await this.applicationRepository.count()) > 0) return;

    const coder = await this.userRepository.findOne({ where: { role: UserRole.CODER } });
    const vacancy = await this.vacancyRepository.findOne({ where: {} }); // Primera vacante

    if (coder && vacancy) {
      await this.applicationRepository.save({
        userId: coder.id,
        vacancyId: vacancy.id,
      });
      this.logger.log('Example application created');
    }
  }
}