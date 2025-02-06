import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const profilesDir = path.join(process.cwd(), 'src/profile'); // Corrected path
    const files = fs.readdirSync(profilesDir);
    // Filter only .icc files
    const iccFiles = files.filter(file => file.endsWith('.icc'));
    const formattedNames = iccFiles.map(file => file.split('.')[0].replace(/-/g, ' ').split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' '));
    return NextResponse.json(formattedNames);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read ICC files' }, { status: 500 });
  }
}