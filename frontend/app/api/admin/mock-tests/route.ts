import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define a global cache so it persists across hot-reloads and works safely in deployment without writing to disk
// Force cache reset round 9 for Real Coding Section
let globalMockTestsCache: any[] | null = null;

const getDataFilePath = () => {
  return path.join(process.cwd(), 'data', 'mockTestsData.json');
};

function getMockTests() {
  if (globalMockTestsCache) return globalMockTestsCache;

  const filePath = getDataFilePath();
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    globalMockTestsCache = JSON.parse(data);
    return globalMockTestsCache;
  }
  return [];
}

export async function GET() {
  try {
    const data = getMockTests();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading mock tests data:', error);
    return NextResponse.json({ error: 'Failed to fetch mock tests data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, logoUrl } = await request.json();

    if (!id || typeof logoUrl !== 'string') {
      return NextResponse.json({ error: 'Missing required fields: id, logoUrl' }, { status: 400 });
    }

    const mockTests = getMockTests();
    if (!mockTests || mockTests.length === 0) {
      return NextResponse.json({ error: 'Mock tests data not loaded' }, { status: 404 });
    }

    // Find and update the specific company logo
    const testIndex = mockTests.findIndex((test: any) => test.id === id);
    if (testIndex === -1) {
      return NextResponse.json({ error: 'Mock test not found' }, { status: 404 });
    }

    // Update the in-memory cache
    mockTests[testIndex].logoUrl = logoUrl;
    globalMockTestsCache = mockTests;

    // We do NOT write back to fs.writeFileSync to avoid deployment crashes on serverless environments!
    
    return NextResponse.json({ success: true, message: 'Logo updated successfully', test: mockTests[testIndex] });
  } catch (error) {
    console.error('Error updating mock tests data:', error);
    return NextResponse.json({ error: 'Failed to update logo' }, { status: 500 });
  }
}
