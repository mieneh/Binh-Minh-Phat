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
import { RecruitmentService } from './recruitment.service';
import { CreateRecruitmentDto } from './dto/create-recruitment.dto';
import { UpdateRecruitmentDto } from './dto/update-recruitment.dto';

@Controller('recruitment')
export class RecruitmentController {
  constructor(private readonly recruitmentService: RecruitmentService) {}

  @Post()
  async create(@Body() dto: CreateRecruitmentDto, @I18n() i18n: I18nContext) {
    const data = await this.recruitmentService.create(dto);
    return {
      status: 201,
      message: i18n.translate('recruitment.createSuccess'),
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.recruitmentService.findAll();
    return { status: 200, data };
  }

  @Get('active')
  async findActive() {
    const data = await this.recruitmentService.findAllActive();
    return { status: 200, data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.recruitmentService.findOne(id);
    return { status: 200, data };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRecruitmentDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.recruitmentService.update(id, dto);
    return {
      status: 200,
      message: i18n.translate('recruitment.updateSuccess'),
      data,
    };
  }

  @Patch(':id/close')
  async close(@Param('id') id: string, @I18n() i18n: I18nContext) {
    const data = await this.recruitmentService.close(id);
    return {
      status: 200,
      message: i18n.translate('recruitment.closeSuccess'),
      data,
    };
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string, @I18n() i18n: I18nContext) {
    await this.recruitmentService.remove(id);
    return {
      status: 200,
      message: i18n.translate('recruitment.deleteSuccess'),
    };
  }
}
