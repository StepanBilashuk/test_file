import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { randomBytes } from 'crypto';

import { BaseService } from '../core/base/base.service';
import { LINK_CODE_REPOSITORY } from '../core/resources/database/databaseEntities.constants';
import { LinkCode } from './entities/linkCode.entity';
import { CreateLinkCodeDto } from './dto/create-link-code.dto';
import { ValidationRules } from '../core/resources/linkCodes/validationRules';

@Injectable()
export class LinkCodesService extends BaseService<LinkCode> {
  constructor(
    @Inject(LINK_CODE_REPOSITORY) private linkCodeRepository: typeof LinkCode,
  ) {
    super(linkCodeRepository);
  }

  async create(
    body: CreateLinkCodeDto,
    userId: number,
    transaction?: Transaction,
  ): Promise<LinkCode> {
    const code = this.generateUniqueCode(ValidationRules.lengthCode)

    return this.linkCodeRepository.create(
      { ...body, code, userId },
      { transaction },
    );
  }

  generateUniqueCode(length: number): string {
    return randomBytes(length).toString('hex').slice(0, length);
  }
}
