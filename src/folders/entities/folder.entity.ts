import {
    Column,
    DataType,
    ForeignKey,
    Table,
    BelongsTo,
    HasMany,
    Scopes, HasOne,
} from 'sequelize-typescript';
import { BaseEntity } from '../../core/base/base.entity';
import { User } from '../../users/entities/user.entity';
import { File } from '../../files/entities/file.entity';
import { Op } from 'sequelize';
import { Permission } from '../../permissions/entities/permission.entity';

@Scopes(() => ({
    ...BaseEntity.mergeScopes({}),
    byName: (name: string) => ({ where: { name } }),
    byParentId: (parentId: number) => ({ where: { parentId } }),
    withChildFolders: () => ({
        include: [
            {
                model: Folder,
                as: 'childFolders'
            }
        ]
    }),
    withFiles: (userId) => ({
        include: [
            {
                model: File,
                as: 'files',
                where: {
                    [Op.or]: [
                        { isPublic: true },
                        {
                            isPublic: false,
                            userId: userId
                        }
                    ]
                },
                required: false
            }
        ]
    }),
    parentFolders: () => ({
        parentId: {
            [Op.is]: null
        }
    }),
    withPermission: (userId: number, permissionLevel: number|number[]) => ({
        include: [
            {
                model: Permission,
                as: 'permission',
                required: false,
                where: {
                    userId,
                    permissionLevel
                }
            }
        ]
    }),
    withCreatorPermission: (userId: number) => ({
        where: {
            [Op.or]: [
                {
                    [Op.and]: [
                        {
                            '$permission.id$': null,
                            userId
                        }
                    ]
                },
                {
                    '$permission.id$': {
                        [Op.not]: null
                    }
                }
            ]
        }
    }),
    searchByFileNameAndFolders: (query: string) => ({
        where: {
            [Op.or]: [
                {
                    '$childFolders.name$': {
                        [Op.like]: `%${query}%`
                    }
                },
                {
                    '$files.originalName$': {
                        [Op.like]: `%${query}%`
                    }
                }
            ]
        }
    })
}))
@Table({ tableName: 'folders' })
export class Folder extends BaseEntity {
    @Column({
        type: DataType.STRING(255),
        allowNull: false,
    })
        name: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
        userId: number;

    @BelongsTo(() => User)
    user: User;

    @ForeignKey(() => Folder)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
        parentId?: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    isDeleted: boolean;

    @BelongsTo(() => Folder)
        parentFolder?: Folder;

    @HasMany(() => Folder)
        childFolders?: Folder[];

    @HasMany(() => File)
        files?: File[];

    @HasOne(() => Permission)
    permission?: Permission;
}
