import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { VacanciesService } from './vacancy.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Vacancies')
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@UseGuards(AuthGuard('jwt'), ApiKeyGuard, RolesGuard) 
@Controller('vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Post()
  @Roles(UserRole.GESTOR, UserRole.ADMIN) 
  @ApiOperation({ summary: 'Crear una nueva vacante (Solo Gestor/Admin)' })
  create(@Body() createVacancyDto: CreateVacancyDto) {
    return this.vacanciesService.create(createVacancyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las vacantes disponibles' })
  findAll() {
    return this.vacanciesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una vacante' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.vacanciesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.GESTOR, UserRole.ADMIN) 
  @ApiOperation({ summary: 'Actualizar vacante (Solo Gestor/Admin)' })
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateVacancyDto: UpdateVacancyDto
  ) {
    return this.vacanciesService.update(id, updateVacancyDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN) 
  @ApiOperation({ summary: 'Eliminar vacante (Solo Admin)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.vacanciesService.remove(id);
  }
}