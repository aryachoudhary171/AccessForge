// src/modules/records/schemas/record.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecordDocument = Record & Document;

@Schema({ timestamps: true })
export class Record {
  @Prop({ required: true })
  title!: string;

  @Prop()
  description!: string;

  @Prop({ type: String, ref: 'User', required: true })
  createdBy!: string;

  @Prop({ default: false })
  isDeleted!: boolean;

  // New fields for financial records
  @Prop({ required: true })
  amount!: number;

  @Prop({ required: true, enum: ['income', 'expense'] })
  type!: string;

  @Prop({ required: true })
  category!: string;

  @Prop()
  createdAt!: Date;

  @Prop()
  updatedAt!: Date;


  @Prop({ default: () => new Date() }) 
  date!: Date;


}

export const RecordSchema = SchemaFactory.createForClass(Record);
RecordSchema.index({ title: 'text', description: 'text' });