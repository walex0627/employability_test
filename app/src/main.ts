import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ValidationPipe, Logger } from '@nestjs/common'; 
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; 
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap'); 

  // 1. Global Interceptor (Standardized Responses)
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  // 2. Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // 3. Swagger Configuration 
  const config = new DocumentBuilder()
    .setTitle('Riwi Employability API')
    .setDescription('API for managing job vacancies and applications')
    .setVersion('1.0')
    .addBearerAuth() // Adds JWT support
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'x-api-key') // Adds API Key support 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); 

  //4. Enable CORS
  app.enableCors();

  // 5. Start Server
  await app.listen(3000);

  // 6. Success Logs
  logger.log('Database connection initialized successfully'); 
  logger.log(`Server is running on: await app.getUrl()`);
  logger.log(`Swagger documentation available at: http://localhost:3000/api/docs`);
}
bootstrap();