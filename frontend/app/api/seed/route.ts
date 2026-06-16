import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import fs from 'fs';
import path from 'path';
import { setStoreData } from '@/lib/db';

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'backend', 'data');
    if (!fs.existsSync(dataDir)) return NextResponse.json({ error: 'No local data found' });

    const files = fs.readdirSync(dataDir);
    let seeded = 0;
    for (const file of files) {
      if (file.endsWith('.json')) {
        const key = file.replace('.json', '');
        const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
        const data = JSON.parse(content);
        await setStoreData(key, data);
        seeded++;
      }
    }

    // Also seed the mock tests data which is in the root data/ folder
    const mockTestsPath = path.join(process.cwd(), 'data', 'mockTestsData.json');
    if (fs.existsSync(mockTestsPath)) {
      const mockTestsContent = fs.readFileSync(mockTestsPath, 'utf8');
      const mockTestsData = JSON.parse(mockTestsContent);
      await setStoreData('mock-tests', mockTestsData);
      seeded++;
    }

    return NextResponse.json({ success: true, message: `Seeded ${seeded} files into Postgres` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
