import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME || 'job-updates';

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.warn("Missing Cloudflare R2 environment variables. Ensure R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY are set.");
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: accessKeyId || '',
    secretAccessKey: secretAccessKey || '',
  },
});

// Helper to convert readable stream to string
const streamToString = (stream: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on('data', (chunk: any) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
};

export async function ensureTableExists() {
  // Not needed for R2 Object Storage, but kept for backwards compatibility with any existing imports
  return;
}

export async function getStoreData<T>(key: string, defaultData: T): Promise<T> {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: `${key}.json`,
    });

    const response = await s3Client.send(command);
    if (response.Body) {
      const bodyContents = await streamToString(response.Body);
      return JSON.parse(bodyContents) as T;
    }
    return defaultData;
  } catch (error: any) {
    // If the file doesn't exist, simply return the default data
    if (error.name === 'NoSuchKey' || error.Code === 'NoSuchKey') {
      return defaultData;
    }
    console.error(`Error reading ${key} from R2:`, error);
    return defaultData;
  }
}

export async function setStoreData<T>(key: string, data: T): Promise<void> {
  try {
    const jsonData = JSON.stringify(data);
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: `${key}.json`,
      Body: jsonData,
      ContentType: 'application/json',
    });

    await s3Client.send(command);
  } catch (error) {
    console.error(`Error writing ${key} to R2:`, error);
  }
}
