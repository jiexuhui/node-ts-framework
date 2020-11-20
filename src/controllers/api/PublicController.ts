import { Request, Response } from 'express';
import { createReadStream } from 'fs';
import * as path from 'path';
import {
    Body, BodyParam, ContentType, Controller, CurrentUser, Delete, Get, Param, Post, Put,
    QueryParam, QueryParams, Req, Res, UploadedFile
} from 'routing-controllers';
import { Container } from 'typedi';

import { CommonUtil } from '../../common/common';
import { CustomEror } from '../../common/customError';
import { config } from '../../config/config';
import { User } from '../../models/api/UserModel';
import { File } from '../../util/file';

@Controller('/public')
export class PublicController {

    /**
     * 上传文件
     * @param user
     * @param file
     */
    @Post('/uploadFile')
    async uploadFile(
        @CurrentUser( { required: true } ) user: User,
        @UploadedFile('file') file: any
    ) {

        const ext = path.extname(file.originalname);
        const fileTypes: string[] = config.fileTypes;
        if (!fileTypes.includes(file.mimetype)) {
            throw new CustomEror('file type not allowed');
        }

        let fileSizeLimit = config.fileSize.image;

        if (file.mimetype == 'application/x-msdownload'
            || file.mimetype == 'application/zip'
            || file.mimetype == 'application/x-zip-compressed') fileSizeLimit = config.fileSize.application;

        if (file.size > fileSizeLimit) {
            throw new CustomEror('maxinum file size exceeded');
        }

        const dir = user && (user.userId) || 'tmp';
        const fileName = File.hashBuffer(file.buffer) + ext;

        const res = File.saveBuffer(file.buffer, dir, fileName);

        return { filePath: res };
    }


    /**
     * 上传文件
     * @param user
     * @param file
     */
    @Post('/uploadFile/ext')
    async uploadFileExt(
        @CurrentUser( { required: true } ) user: User,
        @UploadedFile('file') file: any
    ) {

        const ext = path.extname(file.originalname);
        const fileTypes: string[] = config.fileTypes;
        if (!fileTypes.includes(file.mimetype)) {
            throw new CustomEror('file type not allowed');
        }

        let fileSizeLimit = config.fileSize.image;

        if (file.mimetype == 'application/x-msdownload'
            || file.mimetype == 'application/zip'
            || file.mimetype == 'application/x-zip-compressed') fileSizeLimit = config.fileSize.application;

        if (file.size > fileSizeLimit) {
            throw new CustomEror('maxinum file size exceeded');
        }

        const dir = user && (user.userId) || 'tmp';
        const hash = File.hashBuffer(file.buffer);
        const fileName = hash + ext;
        const zipFile = dir + '/' + fileName;
        const unzipPath = dir + '/' + hash;

        const res = File.saveBuffer(file.buffer, dir, fileName);

        if (file.mimetype == 'application/zip' || file.mimetype == 'application/x-zip-compressed') {
            await File.unzip(zipFile, unzipPath);
        }

        return { filePath: res };
    }


    @Get('/file')
    @ContentType('image/*')
    static async getFile(
        @Res() res: Response,
        @QueryParam('path') path: string
    ) {
        const filePath = File.getDownloadPath(path);
        if (!filePath) return null;

        return createReadStream(filePath);
    }

    /**
     * 获取安装包
     * @param res
     * @param path
     */
    @Get('/package.exe')
    @ContentType('application/x-msdownload')
    static async getPackage(
        @Res() res: Response,
        @QueryParam('path') path: string
    ) {
        const filePath = File.getDownloadPath(path);
        if (!filePath) return null;

        return createReadStream(filePath);
    }

    /**
     * 获取文件
     * @param res
     * @param path
     */
    static async getFileExt(
        req: Request,
        res: Response
    ) {
        let path: any = req.query.path;
        const filePath = File.getDownloadPath(path);
        if (!filePath) {
            const err = new CustomEror('file not found');
            res.status(200).json( { success: false, error: err.toJson() } )
        } else {
            res.setHeader('Content-Disposition', 'attachment;filename=' + path.substr(path.lastIndexOf('/') + 1));
            res.sendFile(filePath);
        }
    }



}