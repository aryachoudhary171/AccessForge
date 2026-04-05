import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogsModule } from '../logs/logs.module'; 

import { RecordsController } from './record.controller';
import { RecordsService } from './record.service';
import { Record, RecordSchema } from './schemas/record.schema';

@Module({
  imports: [
        LogsModule, 

    MongooseModule.forFeature([
      { name: Record.name, schema: RecordSchema },
    ]),
  ],
  controllers: [RecordsController],
  providers: [RecordsService],
  exports: [RecordsService],

  
})
export class RecordsModule {}