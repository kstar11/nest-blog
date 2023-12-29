import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { WINSTON_LOGGER_TOKEN } from '@/winston/winston.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from '@/app.module';
import { FormatResponseInterceptor } from '@/filters/format-response.interceptor';
import { CustomExceptionFilter } from '@/filters/custom-exception.filter';
import { UnloginFilter } from '@/filters/unlogin.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalFilters(new CustomExceptionFilter());
  // 全局开启登录校验
  app.useGlobalFilters(new UnloginFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('六弦之首的个人博客')
    .setDescription('Api 接口文档')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      description: '基于 jwt 认证'
    })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-doc', app, document);

  app.enableCors();
  app.useLogger(app.get(WINSTON_LOGGER_TOKEN));

  const configService = app.get(ConfigService);
  await app.listen(configService.get('nest_server_port'));
}
bootstrap();
