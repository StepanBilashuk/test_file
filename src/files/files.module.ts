import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { MulterModule } from '@nestjs/platform-express';
import { fileProvider } from './providers/file.provider';
import { LinkCodesModule } from '../link-codes/link-codes.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
    imports: [
        MulterModule.register({
            dest: './uploads',
        }),
        PermissionsModule,
    ],
    controllers: [FilesController],
    providers: [FilesService, ...fileProvider],
    exports: [FilesService],
})
export class FilesModule {}
