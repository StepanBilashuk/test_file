import {
    Column,
    DataType,
    ForeignKey,
    Table,
    Scopes,
    HasOne,
} from 'sequelize-typescript';
import { BaseEntity } from '../../core/base/base.entity';
import { User } from '../../users/entities/user.entity';
import { File } from '../../files/entities/file.entity';
import { Folder } from '../../folders/entities/folder.entity';
import { Op } from 'sequelize';

@Scopes(() => ({
    ...BaseEntity.mergeScopes({}),
    byFolder: (folderId: number) => ({ where: { folderId } }),
    byFile: (fileId: number) => ({ where: { fileId } }),
    byFileOrFolder: (fileId: number, folderId: number) => ({
        where: {
            [Op.or]: [
                {
                    folderId: Number(folderId),
                },
                {
                    fileId: Number(fileId),
                },
            ],
        },
    }),
    byPermissionLevel: (permissionLevel: number) => ({
        where: { permissionLevel },
    }),
}))
@Table({ tableName: 'permissions' })
export class Permission extends BaseEntity {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
        userId: number;

    @ForeignKey(() => File)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    fileId: number;

    @ForeignKey(() => Folder)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
        folderId: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    permissionLevel: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
        grantedBy: number;
}
