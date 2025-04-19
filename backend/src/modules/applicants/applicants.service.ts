import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { Applicant, ApplicantDocument } from 'src/schemas/applicant.schema';
import { CreateApplicantDto } from './dto/create-applicant.dto';
import { UpdateApplicantDto } from './dto/update-applicant.dto';

@Injectable()
export class ApplicantsService {
  constructor(
    @InjectModel(Applicant.name)
    private readonly applicantModel: Model<ApplicantDocument>,
    private readonly i18n: I18nService,
  ) {}

  async create(dto: CreateApplicantDto) {
    const existed = await this.applicantModel.findOne({
      recruitmentId: dto.recruitmentId,
    });
    if (existed) {
      throw new BadRequestException(this.i18n.translate('applicant.duplicate'));
    }
    const applicant = await this.applicantModel.create(dto);
    return applicant;
  }

  async findAll() {
    return this.applicantModel
      .find()
      .populate({
        path: 'recruitmentId',
        populate: {
          path: 'positionId',
        },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    const found = await this.applicantModel
      .findById(id)
      .populate({
        path: 'recruitmentId',
        populate: {
          path: 'positionId',
        },
      })
      .exec();
    if (!found) {
      throw new NotFoundException(this.i18n.translate('applicant.notFound'));
    }
    return found;
  }

  async update(id: string, dto: UpdateApplicantDto) {
    const updated = await this.applicantModel
      .findByIdAndUpdate(id, dto, { new: true })
      .populate({
        path: 'recruitmentId',
        populate: {
          path: 'positionId',
        },
      })
      .exec();
    if (!updated) {
      throw new NotFoundException(this.i18n.translate('applicant.notFound'));
    }
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.applicantModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException(this.i18n.translate('applicant.notFound'));
    }
    return true;
  }
}
