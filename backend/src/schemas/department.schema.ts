import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type DepartmentDocument = Department & 
  Document & { _id: mongoose.Types.ObjectId };

@Schema({ timestamps: true })
export class Department {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description?: string;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
