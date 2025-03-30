import {
  Controller,
  Post,
  Body,
  BadRequestException,
  HttpCode,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AuthService } from './auth.service';
import { SignInAuthDto, SignOutAuthDto } from './dto/auth.dto';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('signin')
  async login(@Body() body: SignInAuthDto, @I18n() i18n: I18nContext) {
    const { user, tokens } = await this.authService.signin(body);
    if (!user)
      throw new BadRequestException(i18n.translate('auth.invalidCredentials'));
    return {
      status: 200,
      message: i18n.translate('auth.signinSuccess'),
      tokens,
      user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  async logout(
    @Req() req: Request & { user?: JwtPayload },
    @Body() body: SignOutAuthDto,
    @I18n() i18n: I18nContext,
  ) {
    if (!req.user?.sub) {
      throw new UnauthorizedException(i18n.translate('auth.invalidToken'));
    }

    const result = await this.authService.signout(
      req.user.sub,
      body.refreshToken,
    );

    if (!result)
      throw new BadRequestException(i18n.translate('auth.signoutFailed'));

    return {
      status: 200,
      message: i18n.translate('auth.signoutSuccess'),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(
    @Req() req: Request & { user?: JwtPayload },
    @I18n() i18n: I18nContext,
  ) {
    if (!req.user?.sub) {
      throw new UnauthorizedException(i18n.translate('auth.invalidToken'));
    }
    const user = await this.authService.findById(req.user.sub);
    return {
      status: 200,
      user,
    };
  }
}
