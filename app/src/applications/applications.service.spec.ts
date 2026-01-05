import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsService } from './applications.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { VacanciesService } from '../vacancy/vacancy.service';
import { BadRequestException } from '@nestjs/common';

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  
  // Mocks
  const mockApplicationRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((app) => Promise.resolve({ id: 'app-uuid', ...app })),
    find: jest.fn(),
  };

  const mockVacanciesService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        {
          provide: getRepositoryToken(Application),
          useValue: mockApplicationRepository,
        },
        {
          provide: VacanciesService,
          useValue: mockVacanciesService,
        },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    // --- Escenario 1: Éxito ---
    it('should create an application if validation passes', async () => {
      // Mock Vacancy: Active, empty applications list, max 5 spots
      const mockVacancy = {
        id: 'vac-1',
        isActive: true,
        maxApplicants: 5,
        applications: [], 
      };

      mockVacanciesService.findOne.mockResolvedValue(mockVacancy);

      const dto = { vacancyId: 'vac-1' };
      const userId = 'user-1';

      const result = await service.create(userId, dto);

      expect(result).toEqual({
        id: 'app-uuid',
        userId,
        vacancyId: dto.vacancyId,
      });
    });

    // --- Escenario 2: Error por Cupo Lleno (CRÍTICO) ---
    it('should throw BadRequestException if vacancy is full', async () => {
      // Mock Vacancy: Full capacity (2 spots, 2 applications)
      const mockVacancy = {
        id: 'vac-full',
        isActive: true,
        maxApplicants: 2,
        applications: [{ userId: 'a' }, { userId: 'b' }], // Full!
      };

      mockVacanciesService.findOne.mockResolvedValue(mockVacancy);

      // Expect the service to fail
      await expect(service.create('user-new', { vacancyId: 'vac-full' }))
        .rejects
        .toThrow(BadRequestException);
    });

    // --- Escenario 3: Error por Doble Postulación ---
    it('should throw BadRequestException if user already applied', async () => {
      const userId = 'user-repeat';
      const mockVacancy = {
        id: 'vac-1',
        isActive: true,
        maxApplicants: 5,
        applications: [{ userId: userId }], // User is already here
      };

      mockVacanciesService.findOne.mockResolvedValue(mockVacancy);

      await expect(service.create(userId, { vacancyId: 'vac-1' }))
        .rejects
        .toThrow(BadRequestException);
    });
  });
});