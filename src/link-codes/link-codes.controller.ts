import {
    Body,
    Controller,
    NotFoundException,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FoldersService } from '../folders/folders.service';
import { Sequelize } from 'sequelize-typescript';
import { FilesService } from '../files/files.service';
import { LinkCodesService } from './link-codes.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateLinkCodeDto } from './dto/create-link-code.dto';
import { LinkCodeDto } from './dto/link-code.dto';

@Controller('link-codes')
@ApiTags('Link Codes')
export class LinkCodesController {
    constructor(
        private readonly foldersService: FoldersService,
        private readonly sequelize: Sequelize,
        private readonly filesService: FilesService,
        private readonly linkCodesService: LinkCodesService,
        private readonly usersService: UsersService,
    ) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(
        @Body() body: CreateLinkCodeDto,
        @Req() req,
    ): Promise<LinkCodeDto> {
        return this.sequelize.transaction(async (transaction) => {
            const service = body.fileId
                ? this.filesService
                : this.foldersService;
            const entityId = body.fileId ? body.fileId : body.folderId;

            await this.usersService.findOneByPk(body.sharedWithId, transaction);

            const entity = await service.findOne(
                [
                    { method: ['byId', entityId] },
                    { method: ['byUser', req.user.id] },
                ],
                transaction,
            );

            if (!entity) {
                throw new NotFoundException('Entity not found');
            }

            const linkCode = await this.linkCodesService.create(
                body,
                req.user.id,
                transaction,
            );

            return new LinkCodeDto(linkCode);
        });
    }
}
