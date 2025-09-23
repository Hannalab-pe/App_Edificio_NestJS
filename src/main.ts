import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { DatabaseSeeder } from './database/seeders/database.seeder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Prefijo global para las rutas
  app.setGlobalPrefix('api/v1');

  //Configuracion de validaciones
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  //Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('ViveConecta API')
    .setDescription('API documentation for ViveConecta')
    .setVersion('1.0')
    .addTag('viveconecta')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Ejecutar seeders al iniciar la aplicación
  try {
    const seeder = app.get(DatabaseSeeder);
    await seeder.run();
  } catch (error) {
    console.error('❌ Error ejecutando seeders:', error.message);
    // No detener la aplicación por errores en seeders
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
