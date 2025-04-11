import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/schemas/product.schema';
import { Category, CategorySchema } from 'src/schemas/category.schema';
import { Partner, PartnerSchema } from 'src/schemas/partner.schema';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

import { CloudinaryModule } from '../../common/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Partner.name, schema: PartnerSchema },
    ]),
    CloudinaryModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
