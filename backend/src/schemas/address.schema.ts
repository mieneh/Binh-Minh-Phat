import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type AddressDocument = Address &
  Document & { _id: mongoose.Types.ObjectId };

@Schema({ timestamps: true })
export class Address {
  @Prop({ required: true })
  branchName: string;

  @Prop({
    type: {
      province: { type: String, required: true },
      ward: { type: String },
      street: { type: String },
    },
    required: true,
  })
  location: {
    province: string;
    ward?: string;
    street?: string;
  };

  @Prop()
  hotline?: string;

  @Prop()
  note?: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
