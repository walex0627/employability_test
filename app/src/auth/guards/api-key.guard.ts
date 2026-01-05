import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    
    // 1. Extract the API Key from the headers
    const apiKey = request.header('x-api-key'); 
    
    // 2. Get the valid key from environment variables
    const validApiKey = this.configService.get<string>('API_KEY');

    // 3. Validate match
    if (!apiKey || apiKey !== validApiKey) {
      throw new UnauthorizedException('Invalid or missing API Key.');
    }

    return true;
  }
}