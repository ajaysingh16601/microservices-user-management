import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

// Ensure crypto is available globally for MongoDB driver
if (typeof global.crypto === 'undefined') {
  global.crypto = require('crypto');
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Enable validation with custom error formatting
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (errors) => {
      const result = errors.reduce((acc, error) => {
        acc[error.property] = Object.values(error.constraints || {})[0];
        return acc;
      }, {});
      return new BadRequestException({
        message: result,
        error: 'Bad Request',
        statusCode: 400
      });
    },
    stopAtFirstError: true,
  }));

  // Serve static uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`User Service running on port ${port}`);
}
bootstrap();
