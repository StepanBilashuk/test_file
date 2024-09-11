import * as path from 'node:path';

export class FileHelper {
  static generateFileName(fileOriginalName: string) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(fileOriginalName);
    return `file-${uniqueSuffix}${ext}`;
  }
}
