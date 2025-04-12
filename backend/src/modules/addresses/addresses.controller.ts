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
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  async create(@Body() dto: CreateAddressDto, @I18n() i18n: I18nContext) {
    const data = await this.addressesService.create(dto);
    return {
      status: 201,
      message: i18n.translate('address.createSuccess'),
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.addressesService.findAll();
    return { status: 200, data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.addressesService.findOne(id);
    return { status: 200, data };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.addressesService.update(id, dto);
    return {
      status: 200,
      message: i18n.translate('address.updateSuccess'),
      data,
    };
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string, @I18n() i18n: I18nContext) {
    await this.addressesService.remove(id);
    return {
      status: 200,
      message: i18n.translate('address.deleteSuccess'),
    };
  }
}
