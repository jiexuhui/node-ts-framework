import * as crypto from 'crypto';
import { statSync } from 'fs';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as unzipper from 'unzipper';

import { CustomEror } from '../common/customError';
import { logger } from '../common/logger';

const BASE_PATH = 'files';

export class File {

    /**
     * 计算文件hash
     * @param file
     * @param algo
     */
    public static hash(file: fs.PathLike, algo: string = 'md5' ) {
        return new Promise( (resolve, reject) => {
            fs.createReadStream(file)
                .on('error', error => reject(error))
                .pipe(crypto.createHash(algo).setEncoding('hex'))
                .once('finish', function() {
                    resolve(this.read())
                })
        } )
    }

    /**
     * 计算文件hash
     * @param file
     * @param algo
     */
    public static hashBuffer(buffer: Buffer, algo: string = 'md5' ) {
        const fsHash = crypto.createHash(algo);
        fsHash.update(buffer);
        const hash = fsHash.digest('hex');
        return hash;
    }

    /**
     * 保存文件
     */
    public static save(src: fs.PathLike, dir: string, fileName: string ) {
        const fileDir = BASE_PATH + '/' + dir;

        if (!fs.existsSync(fileDir)) {
            fs.mkdirsSync(fileDir)
        }
        const filePath = fileDir + '/' + fileName;
        const destPath = path.join(process.cwd(), filePath);
        fs.copyFileSync(src, destPath);
        return filePath.substring(5);
    }


    /**
     * 保存文件
     */
    public static saveBuffer(buffer: Buffer, dir: string, fileName: string ): string {
        const fileDir = BASE_PATH + '/' + dir;

        if (!fs.existsSync(fileDir)) {
            fs.mkdirsSync(fileDir)
        }
        const filePath = fileDir + '/' + fileName;
        const destPath = path.join(process.cwd(), filePath);
        fs.writeFileSync(destPath, buffer);
        return filePath.substring(5);
    }


    public static unzip(zipFile: string, unzipPath: string) {
        return new Promise(async (resolve, reject) => {
            zipFile = BASE_PATH + '/' + zipFile;
            unzipPath = BASE_PATH + '/' + unzipPath;

            if (!fs.existsSync(unzipPath)) {
                fs.mkdirsSync(unzipPath)
            }

            const unzipperExtractor = unzipper.Extract({ path: unzipPath });
            unzipperExtractor.on('error', err => {
                logger.error(`Get an error when unzip package, unzipPath: ${unzipPath} err: ${err}`);
                return reject(new CustomEror('10026'));
            })

            const rs = fs.createReadStream(zipFile);

            logger.info(`${zipFile}解压开始`);
            rs.pipe(unzipperExtractor);

            rs.on('data', chunk => {
                logger.debug(`${zipFile}解压开始`);
            })
            rs.on('end', () => {
                logger.debug(`${zipFile}解压结束`);
            })

            unzipperExtractor.on('close', () => {
                resolve();
            })
        })
    }

    /**
     * 获取下载路径
     * @param filePath
     */
    public static getDownloadPath(filePath: string): string | null {
        const fullPath = path.join(process.cwd(), BASE_PATH, filePath);
        if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
            return null;
        }

        return path.resolve(fullPath);
    }

    /**
     * 删除文件
     * @param filePath
     */
    public static delete(filePath: string) {
        const fullPath = path.join(process.cwd(), BASE_PATH, filePath);
        if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
            return;
        }

        fs.unlinkSync(fullPath);
    }

    /**
     * 删除文件
     * @param filePath
     */
    public static async getInfo(filePath: string) {
        const fullPath = path.join(process.cwd(), BASE_PATH, filePath);
        if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
            throw new CustomEror('file not found');
        }

        const { size } = fs.statSync(fullPath);

        const hash = await this.hash(fullPath);

        return { hash, size }
    }
}