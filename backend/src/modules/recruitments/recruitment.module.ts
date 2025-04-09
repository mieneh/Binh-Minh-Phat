import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Recruitment, RecruitmentSchema } from 'src/schemas/recruitment.schema';
import { Position, PositionSchema } from 'src/schemas/position.schema';
import { Applicant, ApplicantSchema } from 'src/schemas/applicant.schema';
import { RecruitmentService } from './recruitment.service';
import { RecruitmentController } from './recruitment.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Recruitment.name, schema: RecruitmentSchema },
      { name: Position.name, schema: PositionSchema },
      { name: Applicant.name, schema: ApplicantSchema },
    ]),
  ],
  controllers: [RecruitmentController],
  providers: [RecruitmentService],
  exports: [RecruitmentService],
})
export class RecruitmentModule {}
