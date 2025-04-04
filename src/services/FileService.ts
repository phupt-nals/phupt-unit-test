import * as fs from 'fs';

export class FileService {
  static writeCSV(fileName: string, data: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const fileHandle = fs.createWriteStream(fileName);
      fileHandle.write(data);
      fileHandle.end();
      fileHandle.on('finish', resolve);
      fileHandle.on('error', reject);
    });
  }
}
