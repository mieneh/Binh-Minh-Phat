import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { Position, PositionDocument } from 'src/schemas/position.schema';
import {
  Recruitment,
  RecruitmentDocument,
} from 'src/schemas/recruitment.schema';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

@Injectable()
export class PositionsService {
  constructor(
    @InjectModel(Position.name)
    private readonly positionModel: Model<PositionDocument>,
    @InjectModel(Recruitment.name)
    private readonly recruitmentModel: Model<RecruitmentDocument>,
    private readonly i18n: I18nService,
  ) {}

  async create(dto: CreatePositionDto) {
    const existed = await this.positionModel.findOne({ code: dto.code });
    if (existed) {
      throw new BadRequestException(
        this.i18n.translate('position.duplicateCode'),
      );
    }
    const position = await this.positionModel.create(dto);
    return position;
  }

  async findAll() {
    return this.positionModel
      .find()
      .populate('departmentId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(code: string) {
    const found = await this.positionModel
      .findOne({ code })
      .populate('departmentId')
      .exec();
    if (!found) {
      throw new NotFoundException(this.i18n.translate('position.notFound'));
    }
    return found;
  }

  async update(code: string, dto: UpdatePositionDto) {
    const position = await this.positionModel.findOne({ code }).exec();
    if (!position) {
      throw new NotFoundException(this.i18n.translate('position.notFound'));
    }
    if (dto.code && dto.code !== position.code) {
      const existed = await this.positionModel.findOne({
        code: dto.code,
      });
      if (existed) {
        throw new BadRequestException(
          this.i18n.translate('position.duplicateCode'),
        );
      }
    }
    const updated = await this.positionModel
      .findOneAndUpdate({ code }, dto, { new: true })
      .exec();
    return updated;
  }

  async remove(code: string) {
    const position = await this.positionModel.findOne({ code }).exec();
    if (!position) {
      throw new NotFoundException(this.i18n.translate('position.notFound'));
    }
    const usingRecruitment = await this.recruitmentModel
      .findOne({ positionCode: code })
      .select('_id title')
      .exec();
    if (usingRecruitment) {
      throw new BadRequestException(this.i18n.translate('position.inUse'));
    }
    await this.positionModel.findOneAndDelete({ code }).exec();
    return true;
  }
}
