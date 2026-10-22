import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger OpenAPI Configuration
  const config = new DocumentBuilder()
    .setTitle('Susi Air Pilot Operations API')
    .setDescription(
      'REST API for the Susi Air Pilot App — Flight duty limit compliance tracking, monthly roster management, and credential status monitoring.\n\n' +
        '**Test Credentials**: `username: johndoe` | `password: susiairtest`',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter your JWT token obtained from POST /auth/login',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Susi Air Pilot API Documentation',
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`[BOOT] Susi Air Pilot API listening on port ${port}`);
  console.log(`[DOCS] Swagger UI available at http://localhost:${port}/api`);
}
bootstrap();
