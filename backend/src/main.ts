import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { I18nValidationPipe, I18nValidationExceptionFilter } from 'nestjs-i18n';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });
  app.enableCors({
    origin: process.env.ALLOWED_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  app.useGlobalPipes(
    new I18nValidationPipe({
      stopAtFirstError: true,
      // whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    }),
  );

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  // Config Swagger
  const config = new DocumentBuilder()
    .setTitle('API FOR HUMAN RESOURCE MANAGEMENT')
    .setDescription('REST API For Documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const swaggerPath = process.env.SWAGGER_PATH || 'docs';
  SwaggerModule.setup(swaggerPath, app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Swagger: http://localhost:${port}/${swaggerPath}`);
  console.log(`API: http://localhost:${port}`);
}
void bootstrap();
