import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3002);
  console.log(`Schedule Service is running on: http://localhost:${process.env.PORT ?? 3002}/graphql`);
}
bootstrap();
