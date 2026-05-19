import { SetMetadata } from '@nestjs/common';
import { BusinessType } from '../constants';

export const LOG_KEY = 'log_metadata';

export interface LogMetadata {
  title: string;
  businessType: BusinessType;
  operatorType?: number;
}

export const Log = (metadata: LogMetadata) =>
  SetMetadata(LOG_KEY, metadata);
