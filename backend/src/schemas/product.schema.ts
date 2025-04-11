import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ProductDocument = Product &
  Document & { _id: mongoose.Types.ObjectId };

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, unique: true })
  lot: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop()
  image?: string;

  @Prop()
  imagePublicId?: string;

  @Prop({ required: true, type: Number, min: 0 })
  quantity?: number;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  })
  categoryId?: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner',
  })
  partnerId?: mongoose.Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
