import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet'; // Default import
import { ValidationPipe } from '@nestjs/common';
import getAvailablePort from 'src/utility/common/port.helper';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = await getAvailablePort(3001, 3002);

  app.use(helmet());
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.enableCors({
    origin: '*', // Allow all origins temporarily
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies to be sent if needed
  });

  await app.listen(port);
  console.log(`Connected on port ${port}`);
}
bootstrap();
