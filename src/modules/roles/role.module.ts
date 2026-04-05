import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Role, RoleSchema } from './schemas/role.schema';
import { Permission, PermissionSchema } from './schemas/permission.schema';

import { RolesService } from './role.service';
import { PermissionsService } from './permission.service';

import { RolesController } from './role.controller';
import { PermissionsController } from './permission.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
  ],
  providers: [
    RolesService,
    PermissionsService,
  ],
  controllers: [
    RolesController,
    PermissionsController,
  ],
  exports: [
    MongooseModule, 
    RolesService,
    PermissionsService,
  ],
})
export class RolesModule {}