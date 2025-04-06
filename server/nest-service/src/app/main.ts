import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
const morgan = require('morgan');
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: true,
      forbidNonWhitelisted: true,
      whitelist: true,
      transform: true,
    }),
  );
  app.use(morgan('dev'));

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle(`Nest-service-GP Open-API`)
    .setDescription('The Nest-service-GP API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  const globalPrefix: string = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port: number = AppModule.port || 3333;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}
bootstrap();
