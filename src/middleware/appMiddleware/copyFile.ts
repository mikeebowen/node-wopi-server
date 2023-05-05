import { NextFunction, Response } from 'express';
import { readdir } from 'fs/promises';
import { extname, join } from 'path';
import { ICustomRequest } from '../../models';
import { updateFile } from '../../utils';

export async function copyFile(req: ICustomRequest, res: Response, next: NextFunction) {
  const files = await readdir(join(process.cwd(), 'files'));
  const { file_name: fileName } = req.query;

  if (!fileName || typeof(fileName) !== 'string') {
    throw new Error('query parameter file_name is missing or has an incorrect type.');
  }

  if (!req.rawBody) {
    throw new Error('Buffer not defined on request');
  }

  let newFileName = fileName as string;
  let count = 1;

  while (files.includes(newFileName)) {
    newFileName = `v${count}.${fileName}`;
    count++;
  }

  await updateFile(join(process.cwd(), 'files', newFileName), req.rawBody);

  const newFiles = await readdir(join(process.cwd(), 'files'));
  newFiles.sort();

  res.status(201);

  return res.json({
    new_file: newFileName,
    files: newFiles.map((f, i) => {
      const ext = extname(f);

      return { id: i, name: f, ext: ext.startsWith('.') ? ext.replace('.', '') : ext };
    }),
  });
}
