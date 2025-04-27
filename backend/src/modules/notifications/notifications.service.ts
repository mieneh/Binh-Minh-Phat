import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Notification,
  NotificationDocument,
  NotificationType,
} from 'src/schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly model: Model<NotificationDocument>,
  ) {}

  create(data: {
    title: string;
    message?: string;
    type: NotificationType;
    refId?: string;
  }) {
    return this.model.create({
      ...data,
      refId: data.refId ? new Types.ObjectId(data.refId) : undefined,
    });
  }

  findAll(type?: NotificationType) {
    const query: any = {};
    if (type) query.type = type;
    return this.model.find(query).sort({ createdAt: -1 }).exec();
  }

  unreadCount() {
    return this.model.countDocuments({ read: false });
  }

  markAsRead(id: string) {
    return this.model.findByIdAndUpdate(id, { read: true }, { new: true });
  }

  markAllRead() {
    return this.model.updateMany({ read: false }, { read: true });
  }

  removeOne(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  removeAll() {
    return this.model.deleteMany({});
  }
}
