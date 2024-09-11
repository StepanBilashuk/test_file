import { Module } from '@nestjs/common';
import { FoldersController } from './folders.controller';
import { FoldersService } from './folders.service';
import { folderProvider } from './providers/folder.provider';
import { FilesModule } from '../files/files.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
    imports: [FilesModule, PermissionsModule],
    controllers: [FoldersController],
    providers: [FoldersService, ...folderProvider],
    exports: [FoldersService]
})
export class FoldersModule {}
