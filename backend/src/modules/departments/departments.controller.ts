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
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  async create(@Body() dto: CreateDepartmentDto, @I18n() i18n: I18nContext) {
    const data = await this.departmentsService.create(dto);
    return {
      status: 201,
      message: i18n.translate('department.createSuccess'),
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.departmentsService.findAll();
    return { status: 200, data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.departmentsService.findOne(id);
    return { status: 200, data };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDepartmentDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.departmentsService.update(id, dto);
    return {
      status: 200,
      message: i18n.translate('department.updateSuccess'),
      data,
    };
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string, @I18n() i18n: I18nContext) {
    await this.departmentsService.remove(id);
    return {
      status: 200,
      message: i18n.translate('department.deleteSuccess'),
    };
  }
}
