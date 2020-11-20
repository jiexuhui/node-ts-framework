import { Request, Response } from 'express';
import {
    Body, BodyParam, Controller, Delete, Get, Param, Post, Put, QueryParam, QueryParams, Req, Res
} from 'routing-controllers';
import { Inject } from 'typedi';

import { CustomEror } from '../../common/customError';
import { User } from '../../entity/api/User';
import { UserService } from '../../services/api/UserService';

import e = require('express');

@Controller()
export class UserController {

    @Inject()
    userService: UserService;

    @Get('/user')
    async createUser(
        @Req() req: Request,
        @Res() res: Response,
        @QueryParams({ validate: false }) user: User
    ): Promise<User> {
        return await this.userService.createUser(user);
    }

    @Post('/login')
    async Login(
        @Req() req: Request,
        @Res() res: Response,
        @Body() user: User
    ): Promise<User> {
        return await this.userService.createUser(user);
    }
}