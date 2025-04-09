import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import {
  Recruitment,
  RecruitmentDocument,
} from 'src/schemas/recruitment.schema';
import { Position, PositionDocument } from 'src/schemas/position.schema';
import { Applicant, ApplicantDocument } from 'src/schemas/applicant.schema';
import { CreateRecruitmentDto } from './dto/create-recruitment.dto';
import { UpdateRecruitmentDto } from './dto/update-recruitment.dto';

@Injectable()
export class RecruitmentService {
  constructor(
    @InjectModel(Recruitment.name)
    private readonly recruitmentModel: Model<RecruitmentDocument>,
    @InjectModel(Position.name)
    private readonly positionModel: Model<PositionDocument>,
    @InjectModel(Applicant.name)
    private readonly applicantModel: Model<ApplicantDocument>,
    private readonly i18n: I18nService,
  ) {}

  async create(dto: CreateRecruitmentDto) {
    const existed = await this.positionModel.findById(dto.positionId);
    if (!existed) {
      throw new BadRequestException(
        this.i18n.translate('recruitment.positionNotFound'),
      );
    }
    if (
      new Date(dto.startDate) <= new Date() ||
      new Date(dto.deadline) <= new Date()
    ) {
      throw new BadRequestException(
        this.i18n.translate('recruitment.invalidDate'),
      );
    }
    const recruitment = await this.recruitmentModel.create({
      ...dto,
      startDate: new Date(dto.startDate),
      deadline: new Date(dto.deadline),
      isActive: true,
    });
    return recruitment;
  }

  async findAll() {
    return this.recruitmentModel
      .find()
      .populate('positionId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findAllActive() {
    return this.recruitmentModel
      .find({
        isActive: true,
        deadline: { $gte: new Date() },
      })
      .populate('positionId')
      .sort({ deadline: 1 })
      .exec();
  }

  async findOne(id: string) {
    const found = await this.recruitmentModel
      .findById(id)
      .populate('positionId')
      .exec();
    if (!found) {
      throw new NotFoundException(this.i18n.translate('recruitment.notFound'));
    }
    return found;
  }

  async update(id: string, dto: UpdateRecruitmentDto) {
    const recruitment = await this.recruitmentModel.findById(id).exec();
    if (!recruitment) {
      throw new NotFoundException(this.i18n.translate('recruitment.notFound'));
    }
    if (
      (dto.startDate && new Date(dto.startDate) <= new Date()) ||
      (dto.deadline && new Date(dto.deadline) <= new Date())
    ) {
      throw new BadRequestException(
        this.i18n.translate('recruitment.invalidDate'),
      );
    }
    const updated = await this.recruitmentModel
      .findByIdAndUpdate(
        id,
        {
          ...dto,
          startDate: dto.startDate
            ? new Date(dto.startDate)
            : recruitment.startDate,
          deadline: dto.deadline
            ? new Date(dto.deadline)
            : recruitment.deadline,
        },
        { new: true },
      )
      .exec();
    return updated;
  }

  async close(id: string) {
    const recruitment = await this.recruitmentModel.findById(id).exec();
    if (!recruitment) {
      throw new NotFoundException(this.i18n.translate('recruitment.notFound'));
    }

    recruitment.isActive = false;
    await recruitment.save();
    return recruitment;
  }

  async remove(id: string) {
    const recruitment = await this.recruitmentModel.findById(id).exec();
    if (!recruitment) {
      throw new NotFoundException(this.i18n.translate('recruitment.notFound'));
    }
    const usingApplicant = await this.applicantModel
      .findOne({ recruitmentID: id })
      .select('_id fullName')
      .exec();
    if (usingApplicant) {
      throw new BadRequestException(this.i18n.translate('recruitment.inUse'));
    }
    await this.recruitmentModel.findByIdAndDelete(id).exec();
    return true;
  }

  async autoExpire() {
    return this.recruitmentModel.updateMany(
      {
        isActive: true,
        deadline: { $lt: new Date() },
      },
      { isActive: false },
    );
  }
}
