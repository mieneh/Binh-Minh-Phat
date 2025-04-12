import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { Address, AddressDocument } from 'src/schemas/address.schema';
import {
  Recruitment,
  RecruitmentDocument,
} from 'src/schemas/recruitment.schema';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectModel(Address.name)
    private readonly addressModel: Model<AddressDocument>,
    @InjectModel(Recruitment.name)
    private readonly recruitmentModel: Model<RecruitmentDocument>,
    private readonly i18n: I18nService,
  ) {}

  async create(dto: CreateAddressDto) {
    const existed = await this.addressModel.findOne({
      branchName: dto.branchName,
    });
    if (existed) {
      throw new BadRequestException(
        this.i18n.translate('address.duplicateBranch'),
      );
    }
    return this.addressModel.create(dto);
  }

  async findAll() {
    return this.addressModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const found = await this.addressModel.findById(id).exec();
    if (!found) {
      throw new NotFoundException(this.i18n.translate('address.notFound'));
    }
    return found;
  }

  async update(id: string, dto: UpdateAddressDto) {
    const address = await this.addressModel.findById(id).exec();
    if (!address) {
      throw new NotFoundException(this.i18n.translate('address.notFound'));
    }
    if (dto.branchName && dto.branchName !== address.branchName) {
      const existed = await this.addressModel.findOne({
        branchName: dto.branchName,
      });
      if (existed) {
        throw new BadRequestException(
          this.i18n.translate('address.duplicateBranch'),
        );
      }
    }
    return this.addressModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async remove(id: string) {
    const address = await this.addressModel.findById(id).exec();
    if (!address) {
      throw new NotFoundException(this.i18n.translate('address.notFound'));
    }
    const usingAddress = await this.recruitmentModel
      .findOne({ addressId: id })
      .select('_id branchName')
      .exec();
    if (usingAddress) {
      throw new BadRequestException(this.i18n.translate('address.inUse'));
    }
    await this.addressModel.findByIdAndDelete(id).exec();
    return true;
  }
}
