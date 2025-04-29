import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & 
  Document & { _id: mongoose.Types.ObjectId };

export enum NotificationType {
  APPLICANT = 'APPLICANT',
  CONTACT = 'CONTACT',
  SYSTEM = 'SYSTEM',
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  title: string;

  @Prop()
  message?: string;

  @Prop({
    type: String,
    enum: Object.values(NotificationType),
    required: true,
  })
  type: NotificationType;

  @Prop({ type: Types.ObjectId })
  refId?: Types.ObjectId;

  @Prop({ default: false })
  read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
