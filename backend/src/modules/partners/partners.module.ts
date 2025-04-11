import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Partner, PartnerSchema } from 'src/schemas/partner.schema';
import { Product, ProductSchema } from 'src/schemas/product.schema';
import { PartnersService } from './partners.service';
import { PartnersController } from './partners.controller';

import { CloudinaryModule } from '../../common/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Partner.name, schema: PartnerSchema },
      { name: Product.name, schema: ProductSchema }
    ]),
    CloudinaryModule,
  ],
  controllers: [PartnersController],
  providers: [PartnersService],
  exports: [PartnersService],
})
export class PartnersModule {}
