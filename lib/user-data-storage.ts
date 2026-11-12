import fs from 'fs';
import path from 'path';
import os from 'os';

// Safe cross-platform & serverless storage (works on Vercel read-only filesystem)
export function getStorageFilePath(filename: string): string {
  const localDir = path.join(process.cwd(), 'data');
  try {
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    const testFile = path.join(localDir, '.write-test');
    fs.writeFileSync(testFile, 'ok');
    fs.unlinkSync(testFile);
    return path.join(localDir, filename);
  } catch {
    // Read-only filesystem (e.g. Vercel serverless) -> use os.tmpdir()
    const tmpDir = path.join(os.tmpdir(), 'job-updates-data');
    if (!fs.existsSync(tmpDir)) {
      try {
        fs.mkdirSync(tmpDir, { recursive: true });
      } catch {}
    }
    return path.join(tmpDir, filename);
  }
}

export async function readJsonStorage<T>(filename: string, fallback: T): Promise<T> {
  try {
    const filePath = getStorageFilePath(filename);
    if (!fs.existsSync(filePath)) {
      return fallback;
    }
    const content = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`Error reading ${filename} storage:`, error);
    return fallback;
  }
}

export async function writeJsonStorage<T>(filename: string, data: T): Promise<void> {
  try {
    const filePath = getStorageFilePath(filename);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error writing ${filename} storage:`, error);
  }
}
