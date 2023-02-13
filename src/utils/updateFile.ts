import { createWriteStream, existsSync } from 'fs';
import { stat, writeFile } from 'fs/promises';
import { fileInfo } from './fileInfo';

export async function updateFile(filePath: string, rawBody: Buffer, updateVersion?: boolean) {
  try {
    if (!existsSync(filePath)) {
      await writeFile(filePath, new Uint8Array(Buffer.from('')));
    }

    const wStream = createWriteStream(filePath);
    wStream.write(rawBody);
    const fileStats = await stat(filePath);
    const time = fileStats.mtimeMs.toString();

    if (updateVersion && fileInfo.info) {
      fileInfo.info.Version = time;
    }


    return time;
  } catch (err) {
    console.error((err as Error).message || err);

    return 0;
  }
}
