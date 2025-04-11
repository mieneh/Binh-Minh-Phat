import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { Product, ProductDocument } from 'src/schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly i18n: I18nService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async create(dto: CreateProductDto) {
    const existed = await this.productModel.findOne({ lot: dto.lot });
    if (existed) {
      throw new BadRequestException(
        this.i18n.translate('product.duplicateLot'),
      );
    }
    let image = '';
    let imagePublicId = '';
    if (dto.image) {
      const uploaded = await this.cloudinary.uploadImage(dto.image, 'products');
      image = uploaded.url;
      imagePublicId = uploaded.publicId;
    }
    const product = await this.productModel.create({
      ...dto,
      image,
      imagePublicId,
    });
    return product;
  }

  async findAll() {
    return this.productModel
      .find()
      .populate('categoryId')
      .populate('partnerId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    const found = await this.productModel
      .findById(id)
      .populate('categoryId')
      .populate('partnerId')
      .exec();
    if (!found) {
      throw new NotFoundException(this.i18n.translate('product.notFound'));
    }
    return found;
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(this.i18n.translate('product.notFound'));
    }
    if (dto.lot && dto.lot !== product.lot) {
      const existed = await this.productModel.findOne({ lot: dto.lot });
      if (existed) {
        throw new BadRequestException(
          this.i18n.translate('product.duplicateLot'),
        );
      }
    }
    const updateData: any = {
      lot: dto.lot ?? product.lot,
      name: dto.name ?? product.name,
      description: dto.description ?? product.description,
      quantity: dto.quantity ?? product.quantity,
      categoryId: dto.categoryId ?? product.categoryId,
      partnerId: dto.partnerId ?? product.partnerId,
    };
    if (dto.removeImage === true) {
      if (product.imagePublicId) {
        await this.cloudinary.deleteImage(product.imagePublicId);
      }
      updateData.image = '';
      updateData.imagePublicId = '';
    }
    if (dto.image && dto.image.startsWith('data:image/')) {
      if (product.imagePublicId) {
        await this.cloudinary.deleteImage(product.imagePublicId);
      }
      const uploaded = await this.cloudinary.uploadImage(dto.image, 'products');
      updateData.image = uploaded.url;
      updateData.imagePublicId = uploaded.publicId;
    }
    const updated = await this.productModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('categoryId')
      .populate('partnerId')
      .exec();
    return updated;
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id).exec();
    if (!product) {
      throw new NotFoundException(this.i18n.translate('product.notFound'));
    }
    await this.cloudinary.deleteImage(product.imagePublicId);
    return true;
  }
}
