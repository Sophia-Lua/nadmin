import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { PermissionsGuard } from './common/guards/permissions.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const prefix = configService.get<string>('API_PREFIX') || '/prod-api';
  const port = configService.get<number>('PORT') || 3000;
  const swaggerEnabled = configService.get<boolean>('SWAGGER_ENABLED') || true;

  app.setGlobalPrefix(prefix);

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalGuards(new PermissionsGuard(new Reflector()));

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalInterceptors(new LoggingInterceptor());

  app.enableCors({
    origin: true,
    credentials: true,
  });

  if (swaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('RuoYi NestJS API')
      .setDescription('RuoYi 后台管理系统 API 文档 - 基于 NestJS + TypeScript 实现')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
      customSiteTitle: 'RuoYi API 文档',
    });
  }

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/swagger`);
}

bootstrap();
