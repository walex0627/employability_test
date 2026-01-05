import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { VacanciesService } from '../vacancy/vacancy.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    // Injecting VacanciesService to handle business logic related to vacancy availability
    private readonly vacanciesService: VacanciesService, 
  ) {}

  /**
   * Creates a new application for a specific user.
   * Validates: 
   * 1. Vacancy exists and is active.
   * 2. User hasn't applied before.
   * 3. Vacancy hasn't reached its maximum capacity.
   */
  async create(userId: string, createApplicationDto: CreateApplicationDto) {
    const { vacancyId } = createApplicationDto;

    // 1. Fetch vacancy with its current applications to check limits
    const vacancy = await this.vacanciesService.findOne(vacancyId);

    // 2. Validate if the vacancy is currently active
    if (!vacancy.isActive) {
      throw new BadRequestException('This vacancy is no longer active.');
    }

    // 3. Check uniqueness: User cannot apply twice to the same vacancy
    const alreadyApplied = vacancy.applications.some(
      (app) => app.userId === userId,
    );

    if (alreadyApplied) {
      throw new BadRequestException('You have already applied to this vacancy.');
    }

    // 4. Validate Capacity: Check if the limit has been reached
    if (vacancy.applications.length >= vacancy.maxApplicants) {
      throw new BadRequestException('The vacancy has reached its maximum number of applicants.');
    }

    // 5. Create and save the application
    const application = this.applicationRepository.create({
      userId,
      vacancyId,
    });

    return await this.applicationRepository.save(application);
  }

  /**
   * Retrieves all applications.
   * Intended for Admin and Manager roles.
   */
  async findAll() {
    return await this.applicationRepository.find({
      relations: ['user', 'vacancy'],
    });
  }

  /**
   * Retrieves the application history for a specific user.
   * Intended for Coder role.
   */
  async findMyApplications(userId: string) {
    return await this.applicationRepository.find({
      where: { userId },
      relations: ['vacancy'], // Include vacancy details for the UI
    });
  }
}