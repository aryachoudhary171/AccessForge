import { Controller, Post, Body, Get, Patch } from '@nestjs/common';
import { RolesService } from './role.service';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  // CREATE ROLE
  @Post()
  create(@Body() body: { name: string }) {
    return this.rolesService.create(body.name);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  //  ASSIGN PERMISSIONS
  @Patch('assign-permissions')
  assignPermissions(
    @Body() body: { roleName: string; permissions: string[] },
  ) {
    return this.rolesService.assignPermissions(
      body.roleName,
      body.permissions,
    );
  }
}