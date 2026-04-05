import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission } from './schemas/permission.schema';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: Model<Permission>,
  ) {}

  async create(data: any) {
    return this.permissionModel.create(data);
  }

  async findByNames(names: string[]) {
    return this.permissionModel.find({ name: { $in: names } });
  }
}