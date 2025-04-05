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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(
    @Body() dto: CreateCategoryDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.categoriesService.create(dto);
    return {
      status: 201,
      message: i18n.translate('category.createSuccess'),
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.categoriesService.findAll();
    return { status: 200, data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.categoriesService.findOne(id);
    return { status: 200, data };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.categoriesService.update(id, dto);
    return {
      status: 200,
      message: i18n.translate('category.updateSuccess'),
      data,
    };
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string, @I18n() i18n: I18nContext) {
    await this.categoriesService.remove(id);
    return {
      status: 200,
      message: i18n.translate('category.deleteSuccess'),
    };
  }
}
