import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { Sequelize } from 'sequelize-typescript';
import { FoldersDto } from '../folders/dto/folders.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { PaginationHelper } from '../core/helpers/pagination.helper';
import { UsersDto } from './dto/users.dto';
import { GetListUsersDto } from './dto/get-list-users.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly sequelize: Sequelize,
    ) {}

    @Post()
    @ApiBody({ type: CreateUserDto })
    @ApiCreatedResponse({
        type: UserDto,
    })
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() body: CreateUserDto): Promise<UserDto> {
        return this.sequelize.transaction(async (transaction) => {
            const user = await this.usersService.create(body, transaction);
            return new UserDto(user);
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
      @Query() query: GetListUsersDto,
      @Request() req,
    ): Promise<UsersDto> {
        let items = [];
        const scopes = [];

        if (query.query) {
            scopes.push({ method: ['searchByEmail', query.query] })
        }

        scopes.push('notDeleted');
        const count = await this.usersService.count(scopes);

        if (count) {
            scopes.push(
              { method: ['pagination', query] }
            )

            items = await this.usersService.findAll(scopes);
        }

        return new UsersDto(items, PaginationHelper.buildPagination(query, count));
    }
}
