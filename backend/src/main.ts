import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });
  app.enableCors({ origin: process.env.ALLOWED_ORIGIN || '*' });

  // Config Swagger
  const config = new DocumentBuilder()
    .setTitle('API BASIC')
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