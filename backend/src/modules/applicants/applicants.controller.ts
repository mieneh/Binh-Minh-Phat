import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ApplicantsService } from './applicants.service';
import { CreateApplicantDto } from './dto/create-applicant.dto';
import { UpdateApplicantDto } from './dto/update-applicant.dto';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller('applicants')
export class ApplicantsController {
  constructor(private readonly applicantsService: ApplicantsService) {}

  @Post()
  async create(@Body() dto: CreateApplicantDto, @I18n() i18n: I18nContext) {
    const data = await this.applicantsService.create(dto);
    return {
      status: 201,
      message: i18n.translate('applicant.createSuccess'),
      data,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    const data = await this.applicantsService.findAll();
    return { status: 200, data };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const data = await this.applicantsService.findOne(id);
    return { status: 200, data };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateApplicantDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.applicantsService.update(id, dto);
    return {
      status: 200,
      message: i18n.translate('applicant.updateSuccess'),
      data,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async remove(@Param('id') id: string, @I18n() i18n: I18nContext) {
    await this.applicantsService.remove(id);
    return {
      status: 200,
      message: i18n.translate('applicant.deleteSuccess'),
    };
  }
}
