import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './schemas/role.schema';
import { PermissionsService } from './permission.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<Role>,
    private permissionsService: PermissionsService,
  ) {}

  async create(name: string) {
    return this.roleModel.create({ name });
  }
async findAll() {
  return this.roleModel.find().populate('permissions');
}
  async assignPermissions(roleName: string, permissionNames: string[]) {
    const role = await this.roleModel.findOne({ name: roleName });

    if (!role) throw new NotFoundException('Role not found');

    const permissions = await this.permissionsService.findByNames(
      permissionNames,
    );

    role.permissions = permissions.map(p => p._id);
    return role.save();
  }
}