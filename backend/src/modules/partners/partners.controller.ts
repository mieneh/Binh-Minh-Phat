import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Post()
  async create(
    @Body() dto: CreatePartnerDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.partnersService.create(dto);
    return {
      status: 201,
      message: i18n.translate('partner.createSuccess'),
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.partnersService.findAll();
    return { status: 200, data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.partnersService.findOne(id);
    return { status: 200, data };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePartnerDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.partnersService.update(id, dto);
    return {
      status: 200,
      message: i18n.translate('partner.updateSuccess'),
      data,
    };
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string, @I18n() i18n: I18nContext) {
    await this.partnersService.remove(id);
    return {
      status: 200,
      message: i18n.translate('partner.deleteSuccess'),
    };
  }
}
