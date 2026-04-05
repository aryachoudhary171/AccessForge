// src/modules/users/schemas/user.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type UserDocument = User & Document;


@Schema({ timestamps: true })
export class User {

  @Prop({ required: true })
name!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ type: Types.ObjectId, ref: 'Role' })
  role!: Types.ObjectId;

  @Prop({ default: false })
  isEmailVerified!: boolean;

 @Prop({ type: String, default: null })
otp?: string;

@Prop({ type: Date, default: null })
otpExpires?: Date;

  @Prop({ enum: ['active', 'inactive'], default: 'active' })
  status!: string;

  @Prop({ default: false })
  isDeleted!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);