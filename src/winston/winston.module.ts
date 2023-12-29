import { DynamicModule, Module, Global } from '@nestjs/common';
import { LoggerOptions } from 'winston';
import { ServerLogger } from '@/winston/ServerLogger';

export const WINSTON_LOGGER_TOKEN = 'WINSTON_LOGGER';

@Global()
@Module({})
export class WinstonModule {
  public static forRoot(options: LoggerOptions): DynamicModule {
    return {
      module: WinstonModule,
      providers: [
        {
          provide: WINSTON_LOGGER_TOKEN,
          useValue: new ServerLogger(options)
        }
      ],
      exports: [WINSTON_LOGGER_TOKEN]
    };
  }
}
