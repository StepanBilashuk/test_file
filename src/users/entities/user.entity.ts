import { Column, DataType, Scopes, Table } from 'sequelize-typescript';

import { BaseEntity } from '../../core/base/base.entity';
import { Op } from 'sequelize';

@Scopes(() => ({
    ...BaseEntity.mergeScopes({}),
    byEmail: (email: string) => ({ where: { email } }),
    byGoogleId: (googleId: string) => ({ where: { googleId } }),
    searchByEmail: (query) => ({
        where: {
            email: {
                [Op.like]: `%${query}%`,
            },
        },
    }),
}))
@Table({ tableName: 'users' })
export class User extends BaseEntity {
    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        unique: true,
    })
    email: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: true,
    })
    password?: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: true,
    })
    salt?: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: true,
        unique: true,
    })
    googleId?: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    isDeleted: boolean;
}
