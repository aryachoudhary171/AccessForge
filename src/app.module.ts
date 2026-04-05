import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/roles/role.module'; 
import { RecordsModule } from './modules/records/record.module';
import { LogsModule } from './modules/logs/logs.module'; 
import { DashboardModule } from './modules/dashboards/dashboard.module';



import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
        DashboardModule,

    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),

    UsersModule,
    AuthModule,
    RecordsModule,
    LogsModule, 

    RolesModule,
  ],
})
export class AppModule {}