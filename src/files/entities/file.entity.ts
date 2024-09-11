import { Table, Column, DataType, ForeignKey, BelongsTo, Default, Scopes } from 'sequelize-typescript';
import { BaseEntity } from '../../core/base/base.entity';
import { User } from '../../users/entities/user.entity';
import { Folder } from '../../folders/entities/folder.entity';

@Scopes(() => ({
  ...BaseEntity.mergeScopes({}),
}))
@Table({
  tableName: 'files',
  timestamps: true,
})
export class File extends BaseEntity {
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
    allowNull: false,
  })
  folderId: number;

  @BelongsTo(() => Folder)
  folder: Folder;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  originalName: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isPublic: boolean;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  isDeleted: boolean;
}
