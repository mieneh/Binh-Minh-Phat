import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { Category, CategoryDocument } from 'src/schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Product, ProductDocument } from 'src/schemas/product.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly i18n: I18nService,
  ) {}

  async create(dto: CreateCategoryDto) {
    const existed = await this.categoryModel.findOne({ name: dto.name });
    if (existed) {
      throw new BadRequestException(
        this.i18n.translate('category.duplicateName'),
      );
    }
    const category = await this.categoryModel.create(dto);
    return category;
  }

  async findAll() {
    return this.categoryModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const found = await this.categoryModel.findById(id).exec();
    if (!found) {
      throw new NotFoundException(this.i18n.translate('category.notFound'));
    }
    return found;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(this.i18n.translate('category.notFound'));
    }
    if (dto.name && dto.name !== category.name) {
      const existed = await this.categoryModel.findOne({ name: dto.name });
      if (existed) {
        throw new BadRequestException(
          this.i18n.translate('category.duplicateName'),
        );
      }
    }
    const updated = await this.categoryModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    return updated;
  }

  async remove(id: string) {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(this.i18n.translate('category.notFound'));
    }
    const usingProduct = await this.productModel
      .findOne({ categoryId: id })
      .select('_id name')
      .exec();
    if (usingProduct) {
      throw new BadRequestException(this.i18n.translate('category.inUse'));
    }
    await this.categoryModel.findByIdAndDelete(id).exec();
    return true;
  }
}
