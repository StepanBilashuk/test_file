import { Module } from '@nestjs/common';

import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { permissionProvider } from './providers/permission.provider';
import { UsersModule } from '../users/users.module';
import { folderProvider } from '../folders/providers/folder.provider';
import { fileProvider } from '../files/providers/file.provider';

@Module({
  imports: [UsersModule],
  providers: [PermissionsService, ...permissionProvider, ...folderProvider, ...fileProvider],
  exports: [PermissionsService],
  controllers: [PermissionsController]
})
export class PermissionsModule {}
