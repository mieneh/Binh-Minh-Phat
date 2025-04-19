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

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contact.name)
    private readonly contactModel: Model<ContactDocument>,
    private readonly i18n: I18nService,
  ) {}

  async create(dto: CreateContactDto) {
    try {
      return await this.contactModel.create({
        ...dto,
        email: dto.email.toLowerCase().trim(),
        fullName: dto.fullName.trim(),
        message: dto.message.trim(),
      });
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
