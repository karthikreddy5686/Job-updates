import { sql } from '@vercel/postgres';

let tableEnsured = false;

export async function ensureTableExists() {
  if (tableEnsured) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS app_data (
        key VARCHAR(255) PRIMARY KEY,
        data JSONB NOT NULL
      );
    `;
    tableEnsured = true;
  } catch (error) {
    console.error('Error creating app_data table:', error);
  }
}

export async function getStoreData<T>(key: string, defaultData: T): Promise<T> {
  await ensureTableExists();
  try {
    const { rows } = await sql`SELECT data FROM app_data WHERE key = ${key}`;
    if (rows.length > 0) {
      return rows[0].data as T;
    }
    return defaultData;
  } catch (error) {
    console.error(`Error reading ${key} from db:`, error);
    return defaultData;
  }
}

export async function setStoreData<T>(key: string, data: T): Promise<void> {
  await ensureTableExists();
  try {
    const jsonData = JSON.stringify(data);
    await sql`
      INSERT INTO app_data (key, data)
      VALUES (${key}, ${jsonData}::jsonb)
      ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data;
    `;
  } catch (error) {
    console.error(`Error writing ${key} to db:`, error);
  }
}
