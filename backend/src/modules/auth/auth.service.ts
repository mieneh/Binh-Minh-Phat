import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly i18n: I18nService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.ensureAdminAccount();
  }

  private async ensureAdminAccount() {
    const email = 'dpm21012003@gmail.com';
    const existingByEmail = await this.userModel.findOne({ email });
    if (existingByEmail) {
      if (existingByEmail.role !== 'admin') {
        existingByEmail.role = 'admin';
        (existingByEmail as any).isActive = true;
        await existingByEmail.save();
        console.log(`Existing user ${email} upgraded to admin.`);
      } else {
        console.log(`Admin account ${email} already exists, skip seeding.`);
      }
      return;
    }
    const password = await bcrypt.hash('Dpm2003@@', 10);
    await this.userModel.create({
      email: email,
      password: password,
      name: 'System Admin',
      role: 'admin',
      isActive: true,
    });
    console.log(`Admin account created with email ${email}. Please change password after first login.`);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .select('-usedRefreshTokens -otp -otpExpiresAt -otpAttempts')
      .exec();
    if (!user)
      throw new NotFoundException(this.i18n.translate('auth.userNotFound'));
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel
      .findOne({ email })
      .select('-usedRefreshTokens -otp -otpExpiresAt -otpAttempts')
      .exec();
    if (!user)
      throw new NotFoundException(this.i18n.translate('auth.emailNotFound'));
    return user;
  }

  // Tạo mã token
  generateTokens(user: UserDocument) {
    const payload = { sub: user._id.toString(), email: user.email, role: user.role };
    const secret = this.configService.get<string>('JWT_SECRET') || 'dev_secret';
    const accessToken = this.jwtService.sign(payload, {
      secret,
      expiresIn: '1d',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret,
      expiresIn: '3d',
    });
    return { accessToken, refreshToken };
  }

  // Xử lí signin
async signin(data: Partial<User>) {
    if (!data.email || !data.password) {
      throw new UnauthorizedException(
        this.i18n.translate('auth.invalidCredentials'),
      );
    }

    const user = await this.userModel.findOne({ email: data.email });
    if (!user) {
      throw new UnauthorizedException(
        this.i18n.translate('auth.invalidCredentials'),
      );
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException(
        this.i18n.translate('auth.invalidCredentials'),
      );
    }

    const tokens = this.generateTokens(user);
    const safeUser = await this.userModel
      .findById(user._id)
      .select('-password -usedRefreshTokens -otp -otpExpiresAt -otpAttempts')
      .exec();

    return { user: safeUser, tokens };
  }

  // Xử lí signout
  async signout(userId: string, refreshToken: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(
        this.i18n.translate('auth.userNotFound'),
      );
    }
    if (refreshToken && !user.usedRefreshTokens.includes(refreshToken)) {
      user.usedRefreshTokens.push(refreshToken);
    }
    await user.save();

    return true;
  }
}
