import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Record, RecordDocument } from './schemas/record.schema';
import { CreateRecordDto} from './dto/create-record.dto';
import { UpdateRecordDto} from './dto/update-record.dto';

import { LogsService } from '../logs/logs.service';

@Injectable()
export class RecordsService {
  constructor(
    @InjectModel(Record.name) private recordModel: Model<RecordDocument>,
    private readonly logsService: LogsService,
  ) {}

  async create(dto: CreateRecordDto, userId: string) {
    const record = new this.recordModel({ ...dto, createdBy: userId });
    const saved = await record.save();

    await this.logsService.createLog({
      userId,
      action: 'CREATE_RECORD',
      resource: 'Record',
      metadata: { recordId: saved._id.toString(), title: saved.title },
    });

    return saved;
  }

  async findAll(filters?: any) {
    const query = { isDeleted: false, ...filters };
    return this.recordModel.find(query);
  }

  async findOne(id: string) {
    const record = await this.recordModel.findOne({ _id: id, isDeleted: false });
    if (!record) throw new NotFoundException('Record not found');
    return record;
  }

  async update(id: string, dto: UpdateRecordDto, userId: string) {
    const record = await this.findOne(id);
    const updated = await this.recordModel.findByIdAndUpdate(id, dto, { new: true });

    await this.logsService.createLog({
      userId,
      action: 'UPDATE_RECORD',
      resource: 'Record',
      metadata: { recordId: id },
    });

    return updated;
  }

  async softDelete(id: string, userId: string) {
    const record = await this.findOne(id);
    const deleted = await this.recordModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

    await this.logsService.createLog({
      userId,
      action: 'DELETE_RECORD',
      resource: 'Record',
      metadata: { recordId: id },
    });

    return deleted;
  }
}