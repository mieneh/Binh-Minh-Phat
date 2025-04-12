import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Position } from './position.schema';
import { Address } from './address.schema';

export type RecruitmentDocument = Recruitment & Document;

@Schema({ timestamps: true })
export class Recruitment {
  @Prop({ type: Types.ObjectId, ref: Position.name, required: true })
  positionId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Address.name, required: true })
  addressId: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  deadline: Date;

  @Prop({ default: 0 })
  experience: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const RecruitmentSchema = SchemaFactory.createForClass(Recruitment);