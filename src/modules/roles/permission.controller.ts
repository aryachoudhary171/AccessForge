import { Controller, Post, Body } from '@nestjs/common';
import { PermissionsService } from './permission.service';

@Controller('permissions')
export class PermissionsController {
  constructor(private permissionsService: PermissionsService) {}

  @Post()
  create(@Body() body: { name: string; description: string }) {
    return this.permissionsService.create(body);
  }
}