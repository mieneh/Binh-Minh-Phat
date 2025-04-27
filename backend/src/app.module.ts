import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  I18nModule,
  I18nJsonLoader,
  AcceptLanguageResolver,
} from 'nestjs-i18n';
import { AuthModule } from './modules/auth/auth.module';
import { join } from 'path';
import { existsSync } from 'fs';
import { PartnersModule } from './modules/partners/partners.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { PositionsModule } from './modules/positions/positions.module';
import { RecruitmentModule } from './modules/recruitments/recruitment.module';
import { UsersModule } from './modules/users/users.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { ApplicantsModule } from './modules/applicants/applicants.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

import { CloudinaryProvider } from './common/cloudinary/cloudinary.provider';

const i18nPath = existsSync(join(__dirname, 'i18n'))
  ? join(__dirname, 'i18n')
  : join(process.cwd(), 'src', 'i18n');

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    I18nModule.forRoot({
      fallbackLanguage: 'vi',
      loader: I18nJsonLoader,
      loaderOptions: {
        path: i18nPath,
        watch: true,
      },
      resolvers: [new AcceptLanguageResolver()],
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    ProductsModule,
    CategoriesModule,
    PartnersModule,
    DepartmentsModule,
    PositionsModule,
    RecruitmentModule,
    UsersModule,
    AddressesModule,
    ApplicantsModule,
    ContactsModule,
    NotificationsModule,
  ],
  providers: [CloudinaryProvider],
})
export class AppModule {}
