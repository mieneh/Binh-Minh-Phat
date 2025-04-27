import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { Contact, ContactDocument } from 'src/schemas/contact.schema';
import { CreateContactDto } from './dto/create-contact.dto';
import { MailService } from 'src/common/mail/mail.service';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import { NotificationType } from 'src/schemas/notification.schema';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contact.name)
    private readonly contactModel: Model<ContactDocument>,
    private readonly i18n: I18nService,
    private readonly mailService: MailService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateContactDto) {
    try {
      const contact = await this.contactModel.create({
        ...dto,
        email: dto.email.toLowerCase().trim(),
        fullName: dto.fullName.trim(),
        message: dto.message.trim(),
      });
      const messageHtml = dto.message
        ? dto.message.replace(/\n/g, '<br/>')
        : '';
      await this.mailService.sendMail({
        to: contact.email,
        subject: this.i18n.translate('contact.mailSubject'),
        html: `
          <p>${this.i18n.translate('contact.hi')} <b>${contact.fullName}</b>,</p>
          <p>${this.i18n.translate('contact.mailThanks')}</p>
          <p>${this.i18n.translate('contact.received')}</p>
          <blockquote>${messageHtml}</blockquote>
          <p>${this.i18n.translate('contact.mailReplySoon')}</p>
          <p>${this.i18n.translate('contact.thanks')},</p>
          <p>${this.i18n.translate('contact.company')}</p>
        `,
      });
      await this.notificationsService.create({
        title: `Liên hệ từ website #${Math.floor(Math.random() * 1000)}`,
        message: dto.fullName,
        type: NotificationType.CONTACT,
        refId: contact._id.toString(),
      });
      return contact;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new BadRequestException(
          this.i18n.translate('contact.alreadySent'),
        );
      }
      throw error;
    }
  }

  async findAll() {
    return this.contactModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const found = await this.contactModel.findById(id).exec();
    if (!found) {
      throw new NotFoundException(this.i18n.translate('contact.notFound'));
    }
    return found;
  }

  async isRead(id: string) {
    const contact = await this.contactModel.findById(id).exec();
    if (!contact) {
      throw new NotFoundException(this.i18n.translate('contact.notFound'));
    }
    contact.read = true;
    await contact.save();
    return contact;
  }
}
