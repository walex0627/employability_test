import { IsEnum, IsInt, IsNotEmpty, IsPositive, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Modality } from '../entities/vacancy.entity';

export class CreateVacancyDto {
  @ApiProperty({ example: 'Backend Developer NestJS', description: 'Título de la vacante' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Desarrollo de APIs RESTful...', description: 'Descripción detallada' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Node.js, TypeScript, PostgreSQL', description: 'Tecnologías requeridas' })
  @IsString()
  @IsNotEmpty()
  technologies: string;

  @ApiProperty({ example: 'Junior Advanced', description: 'Nivel de experiencia' })
  @IsString()
  @IsNotEmpty()
  seniority: string;

  @ApiProperty({ example: 'Comunicación asertiva, Trabajo en equipo', description: 'Habilidades blandas' })
  @IsString()
  @IsNotEmpty()
  softSkills: string;

  @ApiProperty({ example: 'Medellín', description: 'Ubicación de la vacante' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ enum: Modality, example: Modality.REMOTE, description: 'Modalidad de trabajo' })
  @IsEnum(Modality)
  @IsNotEmpty()
  modality: Modality;

  @ApiProperty({ example: '$4.000.000 - $5.000.000', description: 'Rango salarial' })
  @IsString()
  @IsNotEmpty()
  salaryRange: string;

  @ApiProperty({ example: 'Riwi Tech', description: 'Empresa ofertante' })
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty({ example: 5, description: 'Cupo máximo de postulantes permitidos' })
  @IsInt()
  @IsPositive()
  @IsNotEmpty({ message: 'El cupo máximo es obligatorio' }) // Regla de negocio explícita
  maxApplicants: number;
}