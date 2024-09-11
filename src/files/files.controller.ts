import {
  Body,
  Controller, Delete,
  Get,
  NotFoundException,
  Param,
  Patch, Post, Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as path from 'node:path';
import * as fs from 'node:fs';

import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { FilesService } from './files.service';
import { BaseEntityByIdDto } from '../core/dto/base-entity-by-id.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { EmptyDto } from '../core/dto/empty.dto';
import { FileDto } from './dto/file.dto';
import { FileHelper } from '../core/helpers/file.helper';
import { Sequelize } from 'sequelize-typescript';
import { PermissionsService } from '../permissions/permissions.service';
import { PermissionTypes } from '../core/resources/permissions/permissionTypes';

@Controller('files')
@ApiTags('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly sequelize: Sequelize,
    private readonly permissionsService: PermissionsService,
  ) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Bearer')
  @ApiResponse({
    status: 200,
    description: 'File retrieved successfully',
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  async getFile(
    @Param() param: BaseEntityByIdDto,
    @Res() res: Response,
    @Req() req
  ) {
    const file = await this.filesService.findOne([
      { method: ['byId', param.id] }
    ]);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    await this.permissionsService.validateFileAccess(param.id, req.user.id, [PermissionTypes.read, PermissionTypes.write, PermissionTypes.admin], file.folderId);

    const filePath = path.resolve('uploads', file.name);

    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename=${file.originalName}`);
      res.sendFile(filePath);
    } else {
      throw new NotFoundException('File not found');
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Bearer')
  async updateFile(
    @Body() body: UpdateFileDto,
    @Param() param: BaseEntityByIdDto,
    @Request() req,
  ): Promise<FileDto> {
    const file = await this.filesService.findOne([
      { method: ['byId', param.id] }
    ]);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    await this.permissionsService.validateFileAccess(param.id, req.user.id, [PermissionTypes.write, PermissionTypes.admin], file.folderId);

    await file.update(body);

    return new FileDto(file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Bearer')
  async deleteFile(
    @Param() param: BaseEntityByIdDto,
    @Request() req,
  ): Promise<EmptyDto> {
    const file = await this.filesService.findOne([
      { method: ['byId', param.id] }
    ]);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    await this.permissionsService.validateFileAccess(param.id, req.user.id, [PermissionTypes.write, PermissionTypes.admin], file.folderId);

    const filePath = path.resolve('uploads', file.name);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      throw new NotFoundException('File not found');
    }

    await this.filesService.remove(param.id);

    return new EmptyDto();
  }

  @Post(':id/clone')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Bearer')
  cloneFile(
    @Param() param: BaseEntityByIdDto,
    @Request() req,
  ) {
    return this.sequelize.transaction(async (transaction) => {

      const file = await this.filesService.findOne([
        { method: ['byId', param.id] }
      ], transaction);

      if (!file) {
        throw new NotFoundException('File not found');
      }

      await this.permissionsService.validateFileAccess(param.id, req.user.id, [PermissionTypes.write, PermissionTypes.admin], file.folderId);

      const sourceFilePath = path.resolve('uploads', file.name);

      const fileName = FileHelper.generateFileName(file.originalName);
      const destinationFilePath = path.resolve('uploads', fileName);

        try {
          const fileContent = fs.readFileSync(sourceFilePath);
          fs.writeFileSync(destinationFilePath, fileContent);

          await this.filesService.create({
            isPublic: file.isPublic,
            originalName: file.originalName,
            name: fileName,
            folderId: file.folderId,
          }, req.user.id, transaction);

          return new EmptyDto();
        } catch (error) {
          throw new Error('Failed to clone file');
        }
    });
  }
}
