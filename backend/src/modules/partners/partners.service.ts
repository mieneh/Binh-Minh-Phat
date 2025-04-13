import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { Partner, PartnerDocument } from 'src/schemas/partner.schema';
import { Product, ProductDocument } from 'src/schemas/product.schema';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';

@Injectable()
export class PartnersService {
  constructor(
    @InjectModel(Partner.name)
    private readonly partnerModel: Model<PartnerDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly i18n: I18nService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async create(dto: CreatePartnerDto) {
    const existed = await this.partnerModel.findOne({ name: dto.name });
    if (existed) {
      throw new BadRequestException(
        this.i18n.translate('partner.duplicateName'),
      );
    }
    let logo = '';
    let logoPublicId = '';
    if (dto.logo) {
      const uploaded = await this.cloudinary.uploadImage(dto.logo, 'partners');
      logo = uploaded.url;
      logoPublicId = uploaded.publicId;
    }
    const partner = await this.partnerModel.create({
      ...dto,
      logo,
      logoPublicId,
    });
    return partner;
  }

  async findAll() {
    return this.partnerModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const found = await this.partnerModel.findById(id).exec();
    if (!found) {
      throw new NotFoundException(this.i18n.translate('partner.notFound'));
    }
    return found;
  }

  async update(id: string, dto: UpdatePartnerDto) {
    const partner = await this.partnerModel.findById(id).exec();
    if (!partner) {
      throw new NotFoundException(this.i18n.translate('partner.notFound'));
    }
    if (dto.name && dto.name !== partner.name) {
      const existed = await this.partnerModel.findOne({ name: dto.name });
      if (existed) {
        throw new BadRequestException(
          this.i18n.translate('partner.duplicateName'),
        );
      }
    }
    const updateData: any = {
      name: dto.name ?? partner.name,
      website: dto.website ?? partner.website,
      address: dto.address ?? partner.address,
      note: dto.note ?? partner.note,
    };
    if (dto.contact) {
      updateData.contact = {
        phone: dto.contact.phone ?? partner.contact?.phone,
        email: dto.contact.email ?? partner.contact?.email,
        hotline: dto.contact.hotline ?? partner.contact?.hotline,
      };
    }
    if (dto.removeLogo === true) {
      if (partner.logoPublicId) {
        await this.cloudinary.deleteImage(partner.logoPublicId);
      }
      updateData.logo = '';
      updateData.logoPublicId = '';
    }
    if (dto.logo && dto.logo.startsWith('data:image/')) {
      if (partner.logoPublicId) {
        await this.cloudinary.deleteImage(partner.logoPublicId);
      }
      const uploaded = await this.cloudinary.uploadImage(dto.logo, 'partners');
      updateData.logo = uploaded.url;
      updateData.logoPublicId = uploaded.publicId;
    }
    const updated = await this.partnerModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    return updated;
  }

  async remove(id: string) {
    const partner = await this.partnerModel.findById(id).exec();
    if (!partner) {
      throw new NotFoundException(this.i18n.translate('partner.notFound'));
    }
    const usingProduct = await this.productModel
      .findOne({ partnerId: id })
      .select('_id name')
      .exec();
    if (usingProduct) {
      throw new BadRequestException(this.i18n.translate('partner.inUse'));
    }
    await this.partnerModel.findByIdAndDelete(id).exec();
    return true;
  }
}
