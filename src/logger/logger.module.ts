import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonModule, WinstonModuleOptions, utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { transports, format } from 'winston';
import * as DailyRorateFile from 'winston-daily-rotate-file';
import { join } from 'path';

import { LoggerService } from '@/logger/ServerLogger';

const createDialyRotateTransport = (level: string, filename: string, dir: string) => {
  return new DailyRorateFile({
    level,
    dirname: join(process.cwd(), dir),
    filename: `${filename}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    maxSize: '10m',
    maxFiles: '7d',
    format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), format.json())
  });
};

@Module({
  imports: [
    WinstonModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const conbine: any = [];
        conbine.push(format.timestamp());
        conbine.push(nestWinstonModuleUtilities.format.nestLike());
        const ConsoleTransports = new transports.Console({
          level: 'info',
          format: format.combine(...conbine)
        });
        const fileTransports = [
          createDialyRotateTransport('info', 'application', configService.get('log_files_dir')),
          createDialyRotateTransport('warn', 'error', configService.get('log_files_dir'))
        ];
        return {
          transports: [ConsoleTransports, ...fileTransports]
        } as WinstonModuleOptions;
      },
      inject: [ConfigService]
    })
  ],
  providers: [LoggerService],
  exports: [LoggerService]
})
export class LoggerModule {}
