// src/modules/dashboards/dashboard.module.ts
import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { RecordsModule } from '../records/record.module';

@Module({
  imports: [RecordsModule], 
  controllers: [DashboardController],
})
export class DashboardModule {}