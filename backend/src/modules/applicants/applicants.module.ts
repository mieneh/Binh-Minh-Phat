import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Applicant, ApplicantSchema } from 'src/schemas/applicant.schema';
import { Recruitment, RecruitmentSchema } from 'src/schemas/recruitment.schema';
import { ApplicantsService } from './applicants.service';
import { ApplicantsController } from './applicants.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Applicant.name, schema: ApplicantSchema },
      { name: Recruitment.name, schema: RecruitmentSchema },
    ]),
  ],
  controllers: [ApplicantsController],
  providers: [ApplicantsService],
})
export class ApplicantsModule {}
