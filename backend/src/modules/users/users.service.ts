import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { User, UserDocument } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly i18n: I18nService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async create(dto: CreateUserDto) {
    const existed = await this.userModel.findOne({ email: dto.email });
    if (existed) {
      throw new BadRequestException(this.i18n.translate('user.duplicateEmail'));
    }
    const defaultPassword = dto.email.split('@')[0];
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    let avatar = '';
    let avatarPublicId = '';
    if (dto.avatar) {
      const uploaded = await this.cloudinary.uploadImage(dto.avatar, 'users');
      avatar = uploaded.url;
      avatarPublicId = uploaded.publicId;
    }
    return this.userModel.create({
      ...dto,
      password: hashedPassword,
      avatar,
      avatarPublicId,
    });
  }

  async findAll() {
    return this.userModel
      .find()
      .select('-password -usedRefreshTokens -otp')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    const found = await this.userModel
      .findById(id)
      .select('-password -usedRefreshTokens -otp')
      .exec();
    if (!found) {
      throw new NotFoundException(this.i18n.translate('user.notFound'));
    }
    return found;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(this.i18n.translate('user.notFound'));
    }
    const updateData: any = {
      name: dto.name ?? user.name,
      phone: dto.phone ?? user.phone,
      role: dto.role ?? user.role,
    };
    if (dto.address) {
      updateData.address = {
        province: dto.address.province ?? user.address?.province,
        ward: dto.address.ward ?? user.address?.ward,
        street: dto.address.street ?? user.address?.street,
      };
    }
    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, 10);
    }
    if (dto.removeAvatar === true) {
      if (user.avatarPublicId) {
        await this.cloudinary.deleteImage(user.avatarPublicId);
      }
      updateData.avatar = '';
      updateData.avatarPublicId = '';
    }
    if (dto.avatar && dto.avatar.startsWith('data:image/')) {
      if (user.avatarPublicId) {
        await this.cloudinary.deleteImage(user.avatarPublicId);
      }
      const uploaded = await this.cloudinary.uploadImage(dto.avatar, 'users');
      updateData.avatar = uploaded.url;
      updateData.avatarPublicId = uploaded.publicId;
    }
    return this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-password -usedRefreshTokens -otp')
      .exec();
  }

  async remove(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(this.i18n.translate('user.notFound'));
    }
    if (user.avatarPublicId) {
      await this.cloudinary.deleteImage(user.avatarPublicId);
    }
    await this.userModel.findByIdAndDelete(id).exec();
    return true;
  }

  async resetPassword(id: string, dto: ResetPasswordDto) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(this.i18n.translate('user.notFound'));
    }
    if (user.role !== 'employee') {
      throw new BadRequestException(
        this.i18n.translate('user.onlyEmployeeReset'),
      );
    }
    const p = dto.newPassword || crypto.randomBytes(4).toString('hex');
    const hashedPassword = await bcrypt.hash(p, 10);
    user.password = hashedPassword;
    user.usedRefreshTokens = [];
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    user.otpAttempts = 0;
    await user.save();
    return {
      userId: user._id,
      email: user.email,
      newPassword: p,
    };
  }
}
