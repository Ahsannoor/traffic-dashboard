import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
    credentials: true,
  });
  await app.listen(port);
  console.log(`Application running on ${port}`);
}
bootstrap();
