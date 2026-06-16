import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getStoreData, setStoreData } from '@/lib/db';

export async function GET() {
  try {
    const data = await getStoreData('mock-tests', []);
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

    const mockTests = await getStoreData('mock-tests', []);
    if (!mockTests || mockTests.length === 0) {
      return NextResponse.json({ error: 'Mock tests data not loaded' }, { status: 404 });
    }

    // Find and update the specific company logo
    const testIndex = mockTests.findIndex((test: any) => test.id === id);
    if (testIndex === -1) {
      return NextResponse.json({ error: 'Mock test not found' }, { status: 404 });
    }

    // Update the record
    mockTests[testIndex].logoUrl = logoUrl;
    await setStoreData('mock-tests', mockTests);
    
    return NextResponse.json({ success: true, message: 'Logo updated successfully', test: mockTests[testIndex] });
  } catch (error) {
    console.error('Error updating mock tests data:', error);
    return NextResponse.json({ error: 'Failed to update logo' }, { status: 500 });
  }
}
