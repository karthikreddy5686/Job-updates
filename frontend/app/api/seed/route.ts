import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import fs from 'fs';
import path from 'path';
import { setStoreData } from '@/lib/db';
import mockTestsData from '@/data/mockTestsData.json';

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'backend', 'data');
    let seeded = 0;
    
    if (fs.existsSync(dataDir)) {
      const files = fs.readdirSync(dataDir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const key = file.replace('.json', '');
          const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
          const data = JSON.parse(content);
          await setStoreData(key, data);
          seeded++;
        }
      }
    }

    // Seed the mock tests data via static import to guarantee it's bundled
    if (mockTestsData) {
      await setStoreData('mock-tests', mockTestsData);
      seeded++;
    }

    return NextResponse.json({ success: true, message: `Seeded ${seeded} files into Postgres` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
