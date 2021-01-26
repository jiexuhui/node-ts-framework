import { Request, Response } from 'express';
import {
    Body, BodyParam, Controller, Delete, Get, Param, Post, Put, QueryParam, QueryParams, Req, Res
} from 'routing-controllers';
import { Inject } from 'typedi';

import { CustomEror } from '../../common/customError';
import { User } from '../../entity/api/User';
import { UserService } from '../../services/api/UserService';
import * as querystring from 'querystring';
import axios from 'axios';

import e = require('express');

@Controller('/user')
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

    @Get('/rate')
    async Rate(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const params = {
            key: '09435b7ff2afb1f978301f443ef0405f',
            from: 'USD',
            to: 'CNY'
        }
        const url = 'http://op.juhe.cn/onebox/exchange/currency?' + querystring.stringify(params);

        let response = await axios.get(url);

        return response.data;

    }
}