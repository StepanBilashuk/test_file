import {
    Column,
    DataType,
    ForeignKey,
    Table,
    Scopes,
} from 'sequelize-typescript';
import { BaseEntity } from '../../core/base/base.entity';
import { User } from '../../users/entities/user.entity';
import { File } from '../../files/entities/file.entity';
import { Folder } from '../../folders/entities/folder.entity';

@Scopes(() => ({
    ...BaseEntity.mergeScopes({}),
    onlyActive: () => ({ where: { isActive: true } }),
    byCode: (code: string) => ({ where: { code } }),
    byFileId: (fileId: number) => ({ where: { fileId } }),
    byFolderId: (folderId: number) => ({ where: { folderId } }),
}))
@Table({ tableName: 'linkCodes' })
export class LinkCode extends BaseEntity {
    @Column({
        type: DataType.STRING(255),
        allowNull: false,
    })
        code: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    isActive: boolean;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
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

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
        sharedWithId: number;
}
