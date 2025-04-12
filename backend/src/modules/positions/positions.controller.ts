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
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  async create(@Body() dto: CreatePositionDto, @I18n() i18n: I18nContext) {
    const data = await this.positionsService.create(dto);
    return {
      status: 201,
      message: i18n.translate('position.createSuccess'),
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.positionsService.findAll();
    return { status: 200, data };
  }

  @Get(':code')
  async findOne(@Param('id') id: string) {
    const data = await this.positionsService.findOne(id);
    return { status: 200, data };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePositionDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.positionsService.update(id, dto);
    return {
      status: 200,
      message: i18n.translate('position.updateSuccess'),
      data,
    };
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string, @I18n() i18n: I18nContext) {
    await this.positionsService.remove(id);
    return {
      status: 200,
      message: i18n.translate('position.deleteSuccess'),
    };
  }
}
