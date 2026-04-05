// users.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { RolesModule } from '../roles/role.module'; 
import { LogsModule } from '../logs/logs.module'; 


@Module({
  imports: [
        LogsModule, 

    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
    RolesModule, 
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}