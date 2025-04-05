import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateProductDto, @I18n() i18n: I18nContext) {
    const data = await this.productsService.create(dto);
    return {
      status: 201,
      message: i18n.translate('product.createSuccess'),
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.productsService.findAll();
    return { status: 200, data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.productsService.findOne(id);
    return { status: 200, data };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.productsService.update(id, dto);
    return {
      status: 200,
      message: i18n.translate('product.updateSuccess'),
      data,
    };
  }

  @Delete(':id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @I18n() i18n: I18nContext) {
    await this.productsService.remove(id);
    return {
      status: 200,
      message: i18n.translate('product.deleteSuccess'),
    };
  }
}
