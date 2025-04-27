import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { Applicant, ApplicantDocument } from 'src/schemas/applicant.schema';
import {
  Recruitment,
  RecruitmentDocument,
} from 'src/schemas/recruitment.schema';
import { CreateApplicantDto } from './dto/create-applicant.dto';
import { UpdateApplicantDto } from './dto/update-applicant.dto';
import { MailService } from 'src/common/mail/mail.service';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import { NotificationType } from 'src/schemas/notification.schema';

@Injectable()
export class ApplicantsService {
  constructor(
    @InjectModel(Applicant.name)
    private readonly applicantModel: Model<ApplicantDocument>,
    @InjectModel(Recruitment.name)
    private readonly recruitmentModel: Model<RecruitmentDocument>,
    private readonly i18n: I18nService,
    private readonly mailService: MailService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateApplicantDto) {
    const existed = await this.applicantModel.findOne({
      recruitmentId: dto.recruitmentId,
      fullName: dto.fullName,
      phone: dto.phone,
    });
    if (existed) {
      throw new BadRequestException(this.i18n.translate('applicant.duplicate'));
    }
    const applicant = await this.applicantModel.create(dto);
    const recruitment = await this.recruitmentModel
      .findById(dto.recruitmentId)
      .populate({
        path: 'positionId',
        populate: { path: 'departmentId' },
      })
      .exec();
    if (!recruitment) {
      throw new NotFoundException(this.i18n.translate('recruitment.notFound'));
    }
    const positionName =
      recruitment && typeof recruitment.positionId === 'object'
        ? (recruitment.positionId as any).name
        : '';
    const shortProfileHtml = dto.shortProfile
      ? dto.shortProfile.replace(/\n/g, '<br/>')
      : '';
    await this.mailService.sendMail({
      to: process.env.MAIL_COMPANY!,
      subject: this.i18n.translate('applicant.mailSubject'),
      html: `
        <h3>${this.i18n.translate('applicant.info')}</h3>
        <p><b>${this.i18n.translate('applicant.fullName')}:</b> ${dto.fullName}</p>
        <p><b>${this.i18n.translate('applicant.phone')}:</b> ${dto.phone}</p>
        <p><b>${this.i18n.translate('applicant.position')}:</b> ${positionName}</p>
        <p><b>${this.i18n.translate('applicant.experience')}:</b> ${dto.yearsOfExperience} ${this.i18n.translate('applicant.year')}</p>
        ${
          shortProfileHtml
            ? `<p><b>${this.i18n.translate('applicant.shortProfile')}:</b></p>
              <blockquote>${shortProfileHtml}</blockquote>`
            : ''
        }
        ${
          dto.cvLink
            ? `<p><a href="${dto.cvLink}">${this.i18n.translate('applicant.viewCV')}</a></p>`
            : ''
        }
      `,
    });
    await this.notificationsService.create({
      title: `Ứng tuyển vị trí #${Math.floor(Math.random() * 1000)}`,
      message: `${dto.fullName} applied for ${positionName}`,
      type: NotificationType.APPLICANT,
      refId: applicant._id.toString(),
    });
    return applicant;
  }

  async findAll() {
    return this.applicantModel
      .find()
      .populate({
        path: 'recruitmentId',
        populate: {
          path: 'positionId',
          populate: {
            path: 'departmentId',
          },
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
          populate: {
            path: 'departmentId',
          },
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
          populate: {
            path: 'departmentId',
          },
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
