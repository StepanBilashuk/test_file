import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Sequelize } from 'sequelize-typescript';
import { PermissionsService } from './permissions.service';
import { PermissionDto } from './dto/permission.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('permissions')
@ApiTags('Permissions')
export class PermissionsController {
  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly sequelize: Sequelize
  ) {}

  @Post()
  @ApiBody({ type: CreatePermissionDto })
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
    @Request() req,
  ): Promise<PermissionDto> {
    return this.sequelize.transaction(async (transaction) => {
      const permission = await this.permissionsService.create(createPermissionDto, req.user.id, transaction);

      return new PermissionDto(permission);
    })

  }
}
