import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Department } from './department.schema';

export type PositionDocument = Position & 
  Document & { _id: mongoose.Types.ObjectId };

@Schema({ timestamps: true })
export class Position {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: Department.name, required: true })
  departmentId: Types.ObjectId;

  @Prop()
  description?: string;

  @Prop()
  requirement?: string;
}

export const PositionSchema = SchemaFactory.createForClass(Position);