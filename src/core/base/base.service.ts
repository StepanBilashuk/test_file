import { Injectable, NotFoundException } from '@nestjs/common';
import { Transaction, WhereOptions } from 'sequelize';
import { Model, Repository } from 'sequelize-typescript';

@Injectable()
export class BaseService<T extends Model<T>> {
    protected readonly repository: Repository<T>;

    constructor(repository: Repository<T>) {
        this.repository = repository;
    }

    async findAll(scopes = [], transaction?: Transaction): Promise<T[]> {
        return this.repository.scope(scopes).findAll({ transaction });
    }

    async count(scopes = [], transaction?: Transaction): Promise<number> {
        return this.repository.scope(scopes).count({ transaction });
    }

    async findOneByPk(id: number, transaction?: Transaction): Promise<T> {
        const entity = await this.repository.findByPk(id, { transaction });
        if (!entity) {
            throw new NotFoundException(`Entity with ID ${id} not found`);
        }
        return entity;
    }

    async findOne(scopes = [], transaction?: Transaction): Promise<T> {
        return this.repository.scope(scopes).findOne({ transaction });
    }

    async findAndCountAll(
        scopes = [],
        transaction?: Transaction,
    ): Promise<any> {
        return this.repository.scope(scopes).findAndCountAll({ transaction });
    }

    async remove(id: number, transaction?: Transaction): Promise<void> {
        await this.repository.destroy({
            where: { id } as WhereOptions<T>,
            transaction,
        });
    }
}
