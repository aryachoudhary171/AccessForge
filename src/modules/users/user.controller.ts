import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

import { Roles } from '../../common/decorators/roles.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // REGISTER (PUBLIC)
  @Public()
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  // ASSIGN ROLE (ADMIN ONLY)  
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles('Admin')
  @Permissions('update_user')
  @Patch('assign-role')
  assignRole(@Body() body: { email: string; roleName: string }) {
    return this.usersService.assignRole(body.email, body.roleName);
  }

  // GET ALL USERS
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles('User', 'Admin', 'Viewer', 'Analyst')
  @Permissions('view_user')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // GET BY ID
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles('User', 'Admin', 'Viewer', 'Analyst')
  @Permissions('view_user')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // UPDATE (ADMIN ONLY)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles('Admin')
  @Permissions('update_user')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  //  DELETE (ADMIN ONLY)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles('Admin')
  @Permissions('delete_user')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.softDelete(id);
  }
}