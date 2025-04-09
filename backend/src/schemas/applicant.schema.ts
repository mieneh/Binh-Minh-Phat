import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Recruitment } from './recruitment.schema';

export type ApplicantDocument = Applicant & Document;

export enum ApplicantStatus {
  NEW = 'NEW',
  REVIEWED = 'REVIEWED',
  PASS = 'PASS',
  FAIL = 'FAIL',
}

@Schema({ timestamps: true })
export class Applicant {
  @Prop({ type: Types.ObjectId, ref: Recruitment.name, required: true })
  recruitmentID: Types.ObjectId;

  @Prop({ required: true })
  fullName: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop({ required: true })
  phone: string;

  @Prop()
  address?: string;

  @Prop({ default: 0 })
  yearsOfExperience: number;

  @Prop()
  shortProfile?: string;

  @Prop()
  cvLink?: string;

  @Prop({ required: true })
  positionCodeSnapshot: string;

  @Prop({
    type: String,
    enum: Object.values(ApplicantStatus),
    default: ApplicantStatus.NEW,
  })
  status: ApplicantStatus;
}

export const ApplicantSchema = SchemaFactory.createForClass(Applicant);
