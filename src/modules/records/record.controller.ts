import { Controller, Get, Post, Body, Param, Patch, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { RecordsService } from './record.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

@Post()
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles('Admin', 'Analyst', 'Viewer')
@Permissions('create_record')
create(@Body() dto: CreateRecordDto, @Req() req: any) {
  return this.recordsService.create(dto, req.user.userId);
}
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles('Admin', 'Analyst', 'Viewer')
  @Permissions('view_record')
  @Get()
  findAll(@Query() query: any) {
    return this.recordsService.findAll(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles('Admin', 'Analyst', 'Viewer')
  @Permissions('view_record')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recordsService.findOne(id);
  }

@Patch(':id')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles('Admin', 'Analyst')
@Permissions('update_record')
update(@Param('id') id: string, @Body() dto: UpdateRecordDto, @Req() req: any) {
  return this.recordsService.update(id, dto, req.user.userId);
}
@Delete(':id')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles('Admin', 'Analyst')
@Permissions('delete_record')
softDelete(@Param('id') id: string, @Req() req: any) {
  return this.recordsService.softDelete(id, req.user.userId);
}}