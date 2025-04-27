import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Applicant, ApplicantSchema } from 'src/schemas/applicant.schema';
import { Recruitment, RecruitmentSchema } from 'src/schemas/recruitment.schema';
import { ApplicantsService } from './applicants.service';
import { ApplicantsController } from './applicants.controller';
import { MailModule } from 'src/common/mail/mail.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Applicant.name, schema: ApplicantSchema },
      { name: Recruitment.name, schema: RecruitmentSchema },
    ]),
    MailModule,
    NotificationsModule,
  ],
  controllers: [ApplicantsController],
  providers: [ApplicantsService],
})
export class ApplicantsModule {}
