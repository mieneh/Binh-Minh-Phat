import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { NotificationsService } from './notifications.service';
import { NotificationType } from 'src/schemas/notification.schema';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get()
  async getAll(@Query('type') type?: NotificationType) {
    const data = await this.service.findAll(type);
    return {
      status: 200,
      data,
    };
  }

  @Get('unread-count')
  async unreadCount() {
    const data = await this.service.unreadCount();
    return { status: 200, data };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    const data = await this.service.markAsRead(id);
    return { status: 200, data };
  }

  @Patch('read-all')
  async markAllRead() {
    const data = await this.service.markAllRead();
    return { status: 200, data };
  }

  @Delete(':id')
  async removeOne(@Param('id') id: string, @I18n() i18n: I18nContext) {
    await this.service.removeOne(id);
    return {
      status: 200,
      message: i18n.translate('notification.deleteSuccess'),
    };
  }

  @Delete()
  async removeAll(@I18n() i18n: I18nContext) {
    await this.service.removeAll();
    return {
      status: 200,
      message: i18n.translate('notification.deleteAllSuccess'),
    };
  }
}
