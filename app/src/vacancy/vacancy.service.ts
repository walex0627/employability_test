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
    // Retornamos ordenadas por fecha de creación (más recientes primero)
    // y cargamos las postulaciones para ver cuántas llevan (opcional)
    return await this.vacancyRepository.find({
      order: { createdAt: 'DESC' },
      // relations: ['applications'], // Descomentar si quieres ver quiénes se han postulado
    });
  }

  async findOne(id: string): Promise<Vacancy> {
    const vacancy = await this.vacancyRepository.findOne({ 
      where: { id },
      relations: ['applications'], // Importante para validar cupos después
    });

    if (!vacancy) {
      throw new NotFoundException(`La vacante con ID ${id} no fue encontrada`);
    }
    return vacancy;
  }

  async update(id: string, updateVacancyDto: UpdateVacancyDto): Promise<Vacancy> {
    // Primero verificamos que exista
    const vacancy = await this.findOne(id);
    
    // Fusionamos los cambios
    this.vacancyRepository.merge(vacancy, updateVacancyDto);
    
    return await this.vacancyRepository.save(vacancy);
  }

  async remove(id: string): Promise<void> {
    const vacancy = await this.findOne(id);
    await this.vacancyRepository.remove(vacancy);
  }
}