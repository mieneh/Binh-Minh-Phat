import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { Department, DepartmentDocument } from 'src/schemas/department.schema';
import { Position, PositionDocument } from 'src/schemas/position.schema';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department.name)
    private readonly departmentModel: Model<DepartmentDocument>,
    @InjectModel(Position.name)
    private readonly positionModel: Model<PositionDocument>,
    private readonly i18n: I18nService,
  ) {}

  async create(dto: CreateDepartmentDto) {
    const existed = await this.departmentModel.findOne({
      name: dto.name,
    });
    if (existed) {
      throw new BadRequestException(
        this.i18n.translate('department.duplicateName'),
      );
    }
    const department = await this.departmentModel.create(dto);
    return department;
  }

  async findAll() {
    return this.departmentModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const found = await this.departmentModel.findById(id).exec();
    if (!found) {
      throw new NotFoundException(this.i18n.translate('department.notFound'));
    }
    return found;
  }

  async update(id: string, dto: UpdateDepartmentDto) {
    const department = await this.departmentModel.findById(id).exec();
    if (!department) {
      throw new NotFoundException(this.i18n.translate('department.notFound'));
    }
    if (dto.name && dto.name !== department.name) {
      const existed = await this.departmentModel.findOne({
        name: dto.name,
      });
      if (existed) {
        throw new BadRequestException(
          this.i18n.translate('department.duplicateName'),
        );
      }
    }
    const updated = await this.departmentModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    return updated;
  }

  async remove(id: string) {
    const department = await this.departmentModel.findById(id).exec();
    if (!department) {
      throw new NotFoundException(this.i18n.translate('department.notFound'));
    }
    const usingPosition = await this.positionModel
      .findOne({ departmentId: id })
      .select('_id name')
      .exec();
    if (usingPosition) {
      throw new BadRequestException(this.i18n.translate('department.inUse'));
    }
    await this.departmentModel.findByIdAndDelete(id).exec();
    return true;
  }
}
