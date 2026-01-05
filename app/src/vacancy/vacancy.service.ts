import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vacancy } from './entities/vacancy.entity';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';

@Injectable()
export class VacanciesService {
  constructor(
    @InjectRepository(Vacancy)
    private readonly vacancyRepository: Repository<Vacancy>,
  ) {}

  async create(createVacancyDto: CreateVacancyDto): Promise<Vacancy> {
    const vacancy = this.vacancyRepository.create(createVacancyDto);
    return await this.vacancyRepository.save(vacancy);
  }

  async findAll(): Promise<Vacancy[]> {

    return await this.vacancyRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Vacancy> {
    const vacancy = await this.vacancyRepository.findOne({ 
      where: { id },
      relations: ['applications'],
    });

    if (!vacancy) {
      throw new NotFoundException(`La vacante con ID ${id} no fue encontrada`);
    }
    return vacancy;
  }

  async update(id: string, updateVacancyDto: UpdateVacancyDto): Promise<Vacancy> {

    const vacancy = await this.findOne(id);
    

    this.vacancyRepository.merge(vacancy, updateVacancyDto);
    
    return await this.vacancyRepository.save(vacancy);
  }

  async remove(id: string): Promise<void> {
    const vacancy = await this.findOne(id);
    await this.vacancyRepository.remove(vacancy);
  }
}