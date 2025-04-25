import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  app.enableCors({
    origin: 'http://localhost:5173', // tu frontend
    methods: ['GET', 'POST'],
    credentials: true, // si usas cookies o autenticación
  });

  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
