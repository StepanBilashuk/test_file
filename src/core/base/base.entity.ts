import {
    Column,
    CreatedAt,
    DataType,
    Model,
    UpdatedAt,
} from 'sequelize-typescript';

export class BaseEntity extends Model {
    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
    })
    id: number;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    static get scopes() {
        return {
            byId: (id: number) => ({ where: { id: Number(id) } }),
            pagination: (pagination: any) => ({
                limit: Number(pagination.limit),
                offset: Number(pagination.offset),
            }),
            subQuery: (isWithSubQuery: boolean) => ({
                subQuery: isWithSubQuery
            }),
            notDeleted: () => ({
                where: { isDeleted: false },
            }),
            byUser: (userId: number) => ({ where: { userId } }),
        };
    }
    static mergeScopes(scopes: any) {
        return {
            ...this.scopes,
            ...scopes,
        };
    }
}
