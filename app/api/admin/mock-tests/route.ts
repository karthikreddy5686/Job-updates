import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getStoreData, setStoreData } from '@/lib/db';
import staticMockTests from '@/data/mockTestsData.json';

// Helper to get merged mock tests
async function getMergedMockTests() {
  const logoOverrides = await getStoreData<Record<string, string>>('mock-test-logos', {});
  
  // Clone the static data to avoid mutating the imported module
  const merged = JSON.parse(JSON.stringify(staticMockTests));
  
  // Apply any logo overrides from the database
  for (const test of merged) {
    if (logoOverrides[test.id]) {
      test.logoUrl = logoOverrides[test.id];
    }
  }
  
  return merged;
}

export async function GET() {
  try {
    const data = await getMergedMockTests();
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

    const mockTests = await getMergedMockTests();
    
    // Find and verify the test exists
    const testIndex = mockTests.findIndex((test: any) => test.id === id);
    if (testIndex === -1) {
      return NextResponse.json({ error: 'Mock test not found' }, { status: 404 });
    }

    // Save the logo override to the database
    const logoOverrides = await getStoreData<Record<string, string>>('mock-test-logos', {});
    logoOverrides[id] = logoUrl;
    await setStoreData('mock-test-logos', logoOverrides);
    
    // Update the record for the response
    mockTests[testIndex].logoUrl = logoUrl;
    
    return NextResponse.json({ success: true, message: 'Logo updated successfully', test: mockTests[testIndex] });
  } catch (error) {
    console.error('Error updating mock tests data:', error);
    return NextResponse.json({ error: 'Failed to update logo' }, { status: 500 });
  }
}
