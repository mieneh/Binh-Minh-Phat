import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  async create(@Body() dto: CreateContactDto, @I18n() i18n: I18nContext) {
    const data = await this.contactsService.create(dto);
    return {
      status: 201,
      message: i18n.translate('contact.createSuccess'),
      data,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    const data = await this.contactsService.findAll();
    return { status: 200, data };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const data = await this.contactsService.findOne(id);
    return { status: 200, data };
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  async isRead(@Param('id') id: string, @I18n() i18n: I18nContext) {
    const data = await this.contactsService.isRead(id);
    return {
      status: 200,
      message: i18n.translate('contact.isReadSuccess'),
      data,
    };
  }
}
