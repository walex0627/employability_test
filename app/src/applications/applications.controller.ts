import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Applications')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), ApiKeyGuard, RolesGuard) 
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @Roles(UserRole.CODER) // Only Coders can apply
  @ApiOperation({ summary: 'Submit a new application (Coder only)' })
  @ApiResponse({ status: 201, description: 'Application submitted successfully.' })
  @ApiResponse({ status: 400, description: 'Validation failed (Max applicants reached or duplicate application).' })
  create(@Request() req, @Body() createApplicationDto: CreateApplicationDto) {
    // Extracting the user ID from the JWT payload attached to the request
    const userId = req.user.id; 
    return this.applicationsService.create(userId, createApplicationDto);
  }

  @Get('my-applications')
  @Roles(UserRole.CODER)
  @ApiOperation({ summary: 'Get application history for the current user' })
  findAllMyApplications(@Request() req) {
    return this.applicationsService.findMyApplications(req.user.id);
  }

  @Get()
  @Roles(UserRole.GESTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'List all applications (Manager/Admin only)' })
  findAll() {
    return this.applicationsService.findAll();
  }
}