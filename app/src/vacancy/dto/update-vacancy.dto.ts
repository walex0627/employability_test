import { PartialType } from '@nestjs/swagger';
import { CreateVacancyDto } from './create-vacancy.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVacancyDto extends PartialType(CreateVacancyDto) {
  // Agregamos la opción de activar/inactivar manualmente si se desea
  @ApiPropertyOptional({ example: true, description: 'Estado de la vacante' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}