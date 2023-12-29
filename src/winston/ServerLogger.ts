import { LoggerService } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { createLogger, Logger } from 'winston';

export class ServerLogger implements LoggerService {
  private logger: Logger;
  constructor(options) {
    this.logger = createLogger(options);
  }
  log(message: string, context: string) {
    const time = dayjs().format('YYYY-MM-DD hh:mm:ss');
    this.logger.log('info', message, { context, time });
  }
  error(message: string, context: string) {
    const time = dayjs().format('YYYY-MM-DD hh:mm:ss');
    this.logger.log('errr', message, { context, time });
  }

  warn(message: string, context: string) {
    const time = dayjs().format('YYYY-MM-DD hh:mm:ss');
    this.logger.log('warn', message, { context, time });
  }
}
