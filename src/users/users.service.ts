import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { BaseService } from '../core/base/base.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Transaction } from 'sequelize';
import * as bcrypt from 'bcrypt';

import { CreateUserByGoogleDto } from './dto/create-user-by-google.dto';
import { USER_REPOSITORY } from '../core/resources/database/databaseEntities.constants';
import { Common } from '../core/resources/common/validationRules.constant';

@Injectable()
export class UsersService extends BaseService<User> {
    constructor(@Inject(USER_REPOSITORY) private userRepository: typeof User) {
        super(userRepository);
    }

    async create(
        body: CreateUserDto,
        transaction?: Transaction,
    ): Promise<User> {
        let user: User = await this.findOne(
            [{ method: ['byEmail', body.email] }],
            transaction,
        );

        if (user) {
            throw new BadRequestException('User already exists');
        }

        const hashedPassword = await this.generateHashPassword(body.password);

        user = await this.userRepository.create(
            {
                email: body.email,
                password: hashedPassword.hashPassword,
                salt: hashedPassword.salt,
            },
            { transaction },
        );

        return user;
    }

    async createFromGoogleAccount(
        body: CreateUserByGoogleDto,
        transaction?: Transaction,
    ): Promise<User> {
        let user: User = await this.findOne(
            [{ method: ['byEmail', body.email] }],
            transaction,
        );

        if (user) {
            throw new BadRequestException('User already exists');
        }

        user = await this.userRepository.create({ ...body }, { transaction });

        return user;
    }

    private async generateHashPassword(
        password: string,
    ): Promise<{ hashPassword: string; salt: string }> {
        const salt = await bcrypt.genSalt(Common.SaltPassword);
        const hashPassword = await bcrypt.hash(password, salt);
        return { hashPassword, salt };
    }
}
