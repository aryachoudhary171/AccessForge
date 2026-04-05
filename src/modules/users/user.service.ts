

// src/modules/users/user.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User } from './schemas/user.schema';
import { Role } from '../roles/schemas/role.schema';
import { LogsService } from '../logs/logs.service'; 


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
    private logsService: LogsService, 
  ) {}

  // =========================
  // CREATE USER
  // =========================
  async create(data: any) {
    const hashedPassword = data.password
      ? await bcrypt.hash(data.password, 10)
      : undefined;

    return this.userModel.create({
      ...data,
      password: hashedPassword,
    });
  }

  // =========================
  // FIND BY EMAIL
  // =========================
  async findByEmail(email: string) {
    return this.userModel
      .findOne({ email })
      .populate({
        path: 'role',
        model: 'Role',
        populate: {
          path: 'permissions',
          model: 'Permission',
        },
      });
  }

  // =========================
  // UPSERT USER
  // =========================
  async upsertByEmail(email: string, data: any) {
    return this.userModel.findOneAndUpdate(
      { email },
      { $set: data },
      { upsert: true, returnDocument: 'after' }, 
    );
  }

  async updateByEmail(email: string, data: any) {
    return this.userModel.findOneAndUpdate(
      { email },
      { $set: data },
      { returnDocument: 'after' },
    );
  }

  // =========================
  // ASSIGN ROLE TO USER
  // =========================
  async assignRole(email: string, roleName: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');

    const role = await this.roleModel.findOne({ name: roleName });
    if (!role) throw new NotFoundException('Role not found');

    user.role = role._id;
    await user.save(); 
    await this.logsService.createLog({
      userId: user._id.toString(),
      action: 'ROLE_ASSIGNED',
      resource: 'User',
      metadata: { roleName },
    });

    return user;
  }

  async getRoleByName(name: string) {
    return this.roleModel.findOne({ name });
  }

  // =========================
  // GET ALL USERS
  // =========================
  async findAll() {
    return this.userModel.find({ isDeleted: false });
  }

  // =========================
  // GET USER BY ID
  // =========================
  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // =========================
  // UPDATE USER
  // =========================
  async update(id: string, data: any) {
    return this.userModel.findByIdAndUpdate(id, data, {
      returnDocument: 'after',
    });
  }

  // =========================
  // SOFT DELETE USER
  // =========================
  async softDelete(id: string) {
    return this.userModel.findByIdAndUpdate(id, {
      isDeleted: true,
    });
  }

  // =========================
  // TOGGLE STATUS
  // =========================
  async toggleStatus(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');

    user.status = user.status === 'active' ? 'inactive' : 'active';
    return user.save();
  }
}