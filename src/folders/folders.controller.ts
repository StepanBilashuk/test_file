import {
    BadRequestException,
    Body,
    Controller, Get,
    HttpCode,
    HttpStatus, NotFoundException, Param, ParseFilePipeBuilder,
    Post, Query,
    Request, UploadedFile,
    UseGuards, UseInterceptors,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody, ApiConsumes,
    ApiCreatedResponse,
    ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { Sequelize } from 'sequelize-typescript';
import { memoryStorage } from 'multer';

import { CreateFolderDto } from './dto/create-folder.dto';
import { FoldersService } from './folders.service';
import { FolderDto } from './dto/folder.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { BaseEntityByIdDto } from '../core/dto/base-entity-by-id.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidationRules } from '../core/resources/files/validationRules';
import { EmptyDto } from '../core/dto/empty.dto';
import { CreateFileDto } from '../files/dto/create-file.dto';
import { FilesService } from '../files/files.service';
import { FileHelper } from '../core/helpers/file.helper';
import { PermissionsService } from '../permissions/permissions.service';
import { PermissionTypes } from '../core/resources/permissions/permissionTypes';
import { BaseRequestPaginationDto } from '../core/dto/base-request-pagination.dto';
import { FoldersDto } from './dto/folders.dto';
import { PaginationHelper } from '../core/helpers/pagination.helper';
import { GetListFoldersDto } from './dto/get-list-folders.dto';
import { GetFilesAndFoldersDto } from './dto/get-files-and-folders.dto';

@Controller('folders')
@ApiTags('folders')
export class FoldersController {
    constructor(
        private readonly foldersService: FoldersService,
        private readonly sequelize: Sequelize,
        private readonly filesService: FilesService,
        private readonly permissionsService: PermissionsService,
    ) {}

    @Post()
    @ApiBody({ type: CreateFolderDto })
    @ApiCreatedResponse({
        type: FolderDto,
    })
    @ApiBearerAuth('Bearer')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() body: CreateFolderDto,
        @Request() req,
    ): Promise<FolderDto> {
        return this.sequelize.transaction(async (transaction) => {
            if (body.parentId) {
                await this.permissionsService.validateFolderAccess(body.parentId, req.user.id, [PermissionTypes.write, PermissionTypes.admin], transaction);
                await this.foldersService.findOneByPk(body.parentId, transaction);
            }

            const folder = await this.foldersService.create(
                body,
                req.user.id,
                transaction,
            );

            await this.permissionsService.createAdminPermission(req.user.id, folder.id, undefined, transaction);
            return new FolderDto(folder);
        });
    }

    @Get()
    @ApiCreatedResponse({
        type: FoldersDto,
    })
    @ApiBearerAuth('Bearer')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async getList(
      @Query() query: BaseRequestPaginationDto,
      @Request() req,
    ): Promise<FoldersDto> {
        const userId = req.user.id;
        let items = [];

        const scopes = [
            'parentFolders',
            { method: ['withPermission', userId, [PermissionTypes.read, PermissionTypes.write, PermissionTypes.admin] ] },
            { method: ['withCreatorPermission', userId ]}
        ];

        const count = await this.foldersService.count(scopes);

        if (count) {
            scopes.push(
              { method: ['pagination', query] }
            )

            items = await this.foldersService.findAll(scopes);
        }

        return new FoldersDto(items, PaginationHelper.buildPagination(query, count));
    }

    @Get(':id/list')
    @ApiCreatedResponse({
        type: GetFilesAndFoldersDto,
    })
    @ApiBearerAuth('Bearer')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async getOne(
      @Param() params: BaseEntityByIdDto,
      @Query() query: GetListFoldersDto,
      @Request() req,
    ): Promise<GetFilesAndFoldersDto> {
        const scopes = [
            { method: ['byId', params.id ] },
            'withChildFolders',
            { method: ['withFiles', req.user.id] },
            { method: ['subQuery', false] },
            { method: ['pagination', query] }
        ];

        if (query.query) {
            scopes.push({ method: ['searchByFileNameAndFolders', query.query] });
        }

        await this.permissionsService.validateFolderAccess(params.id, req.user.id, [PermissionTypes.write, PermissionTypes.admin, PermissionTypes.read]);

        const parentFolder = await this.foldersService.findAndCountAll(scopes);

        return new GetFilesAndFoldersDto(parentFolder.rows[0], PaginationHelper.buildPagination(query, parentFolder.count))
    }

    @Get(':code/code')
    @ApiCreatedResponse({
        type: FolderDto,
    })
    @ApiBearerAuth('Bearer')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async getFolderByGoogle(
      @Param() params: BaseEntityByIdDto,
      @Request() req,
    ): Promise<FolderDto> {

        const folder = await this.foldersService.findOne([
            { method: ['byId', params.id] },
            'withChildFolders',
            'withFiles'
        ]);

        return new FolderDto(folder);
    }

    @Post(':id/upload-file')
    @ApiConsumes('multipart/form-data')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('Bearer')
    @ApiBody({
        description: 'Upload file',
        type: 'multipart/form-data',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
                body: {
                    type: 'string',
                    description: 'JSON string representing additional form data'
                }
            },
        },
    })
    @UseInterceptors(
      FileInterceptor('file', {
          storage: memoryStorage()
      })
    )
    async uploadFile(
      @Param() params: BaseEntityByIdDto,
      @Body() body: any,
      @Request() req,
      @UploadedFile(
        new ParseFilePipeBuilder()
          .addMaxSizeValidator({ maxSize: ValidationRules.maxValidSize })
          .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
      )
        file,
    ) {
        return this.sequelize.transaction(async (transaction) => {
            let parsedBody;

            try {
                parsedBody = JSON.parse(body.body);
            } catch (error) {
                throw new BadRequestException('Invalid JSON format in body');
            }

            const fileName = FileHelper.generateFileName(file.originalname)

            const uploadFileDto = plainToInstance(CreateFileDto, {
                ...parsedBody,
                name: fileName,
                originalName: file.originalname,
                folderId: params.id
            });

            const errors = await validate(uploadFileDto);

            if (errors.length) {
                throw new BadRequestException('Validation failed');
            }

            const folder = await this.foldersService.findOne([
                { method: ['byId', params.id] }
            ], transaction);

            if (!folder) {
                throw new NotFoundException('Folder not found');
            }

            await this.permissionsService.validateFolderAccess(params.id, req.user.id, [PermissionTypes.write, PermissionTypes.admin], transaction);

            const createdFile = await this.filesService.create({
                isPublic: parsedBody.isPublic,
                originalName: file.originalname,
                name: fileName,
                folderId: params.id,
            }, req.user.id, transaction);

            await this.permissionsService.createAdminPermission(req.user.id, undefined, createdFile.id, transaction);

            const uploadPath = './uploads';
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }

            const filePath = path.join(uploadPath, fileName);

            fs.writeFileSync(filePath, file.buffer);

            return new EmptyDto();
        });
    }
}
