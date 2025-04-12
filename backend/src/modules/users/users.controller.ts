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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDto, @I18n() i18n: I18nContext) {
    const data = await this.usersService.create(dto);
    return {
      status: 201,
      message: i18n.translate('user.createSuccess'),
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.usersService.findAll();
    return { status: 200, data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.usersService.findOne(id);
    return { status: 200, data };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.usersService.update(id, dto);
    return {
      status: 200,
      message: i18n.translate('user.updateSuccess'),
      data,
    };
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string, @I18n() i18n: I18nContext) {
    await this.usersService.remove(id);
    return {
      status: 200,
      message: i18n.translate('user.deleteSuccess'),
    };
  }

  
  @Post(':id/reset-password')
  async resetPassword(
    @Param('id') id: string,
    @Body() dto: ResetPasswordDto,
    @I18n() i18n: I18nContext,
  ) {
    const data = await this.usersService.resetPassword(id, dto);
    return {
      status: 200,
      message: i18n.translate('user.resetPasswordSuccess'),
      data,
    };

  }
}