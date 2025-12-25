import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Savore API')
    .setDescription('Savore Backend API Documentation - Content Commerce Platform')
    .setVersion('1.0')
    .addTag('Authentication', 'User authentication endpoints')
    .addTag('Admin', 'Admin management endpoints')
    .addTag('Ingredients', 'Ingredients management (SUPPLIER)')
    .addTag('Posts', 'Posts management (CREATOR)')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Savore API Docs',
    customfavIcon: 'https://nestjs.com/img/logo_text.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  await app.listen(process.env.PORT ?? 3003);
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3003}`);
  console.log(`Swagger UI is running on: http://localhost:${process.env.PORT ?? 3003}/api`);
}
bootstrap();
