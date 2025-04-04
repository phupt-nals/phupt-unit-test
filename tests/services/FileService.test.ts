import * as fs from 'fs';

import { FileService } from '@src/services/FileService';

jest.mock('fs');

describe('FileService', () => {
  it('should write data to a file and resolve the promise', async () => {
    const mockWriteStream = {
      write: jest.fn(),
      end: jest.fn(),
      on: jest.fn(),
    };
    mockWriteStream.on.mockImplementation((event, callback) => {
      if (event === 'finish') {
        callback();
      }
      return mockWriteStream;
    });
    jest.spyOn(fs, 'createWriteStream').mockReturnValue(mockWriteStream as any);

    const fileName = 'test.csv';
    const data = 'ID,Name,Amount\n1,Item A,100\n2,Item B,150';

    const result = FileService.writeCSV(fileName, data);

    expect(fs.createWriteStream).toHaveBeenCalledWith(fileName);
    expect(mockWriteStream.write).toHaveBeenCalledWith(data);
    expect(mockWriteStream.end).toHaveBeenCalled();
    await expect(result).resolves.toBeUndefined();
  });

  it('should reject the promise if an error occurs', async () => {
    const mockWriteStream = {
      write: jest.fn(),
      end: jest.fn(),
      on: jest.fn(),
    };
    mockWriteStream.on.mockImplementation((event, callback) => {
      if (event === 'error') {
        callback(new Error('Write error'));
      }
      return mockWriteStream;
    });
    jest.spyOn(fs, 'createWriteStream').mockReturnValue(mockWriteStream as any);

    const fileName = 'test.csv';
    const data = 'ID,Name,Amount\n1,Item A,100\n2,Item B,150';

    await expect(FileService.writeCSV(fileName, data)).rejects.toThrow('Write error');
  });
});
