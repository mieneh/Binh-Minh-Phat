import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ContactDocument = Contact &
  Document & { _id: mongoose.Types.ObjectId };

@Schema({ timestamps: true })
export class Contact {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop()
  company?: string;

  @Prop()
  country?: string;

  @Prop()
  volume?: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  read: boolean;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);

ContactSchema.index({ fullName: 1, email: 1, message: 1 }, { unique: true });
