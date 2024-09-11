import { Module } from '@nestjs/common';
import { LinkCodesService } from './link-codes.service';
import { linkCodeProvider } from './providers/link-code.provider';
import { LinkCodesController } from './link-codes.controller';
import { FoldersModule } from '../folders/folders.module';
import { FilesModule } from '../files/files.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [FoldersModule, FilesModule, UsersModule],
    providers: [LinkCodesService, ...linkCodeProvider],
    exports: [LinkCodesService],
    controllers: [LinkCodesController],
})
export class LinkCodesModule {}
