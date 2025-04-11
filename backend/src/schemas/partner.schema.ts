import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type PartnerDocument = Partner &
  Document & { _id: mongoose.Types.ObjectId };

@Schema({ timestamps: true })
export class Partner {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  logo?: string;

  @Prop()
  logoPublicId?: string;

  @Prop()
  website?: string;

  @Prop()
  address?: string;

  @Prop({
    type: {
      phone: { type: String },
      email: { type: String },
      hotline: { type: String },
    },
  })
  contact?: {
    phone?: string;
    email?: string;
    hotline?: string;
  };

  @Prop()
  note?: string;
}

export const PartnerSchema = SchemaFactory.createForClass(Partner);
