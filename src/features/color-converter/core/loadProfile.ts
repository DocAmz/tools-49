import fs from 'fs';
import { parseICCProfileHeader } from '../parser/icc-parser-header';
import { parseICCTagTable } from '../parser/icc-parser-tagTable';
import { parseXYZTag } from '../parser/icc-parser-tagXYZ';
import { GamutTag } from '../types/tags';
import { CurveData, ParametricCurveData } from '../types/curve';
import { parseGamtTag } from '../parser/icc-parser-gamut';
import { ICCProfile } from '../types/ICCProfile';


export function loadICCProfile(profilePath: string): ICCProfile {
  const buffer = fs.readFileSync(profilePath);

  // Parse the header
  const header = parseICCProfileHeader(buffer);

  // Parse the tag table
  const tagCount = buffer.readUInt32BE(128);
  const tags = parseICCTagTable(buffer, 132, tagCount);

  // Parse all tags and store their data in a Record
  let parsedTags: Record<string, Buffer> = {};
  for (const tag of tags) {
    parsedTags[tag.signature] = buffer.subarray(tag.offset, tag.offset + tag.size);
  }

  // Parse specific tags if they exist
  // Parse specific tags if they exist
  const rXYZ = parsedTags['rXYZ'] ? parseXYZTag(parsedTags['rXYZ'], 0) : undefined;
  const gXYZ = parsedTags['gXYZ'] ? parseXYZTag(parsedTags['gXYZ'], 0) : undefined;
  const bXYZ = parsedTags['bXYZ'] ? parseXYZTag(parsedTags['bXYZ'], 0) : undefined;
  const wtpt = parsedTags['wtpt'] ? parseXYZTag(parsedTags['wtpt'], 0) : undefined;

  // Extract A2B0 and B2A0 tags if they exist
  const A2B0 = parsedTags['A2B0'] ? parsedTags['A2B0'] : undefined;
  const A2B1 = parsedTags['A2B1'] ? parsedTags['A2B1'] : undefined;
  const A2B2 = parsedTags['A2B2'] ? parsedTags['A2B2'] : undefined;
  const B2A0 = parsedTags['B2A0'] ? parsedTags['A2B0'] : undefined;
  const B2A1 = parsedTags['A2B1'] ? parsedTags['A2B1'] : undefined;
  const B2A2 = parsedTags['A2B2'] ? parsedTags['A2B2'] : undefined;

  // Parse the gamt tag if it exists
  const gamt = parsedTags['gamt'] ? parseGamtTag(parsedTags['gamt']) : undefined;

  console.log('Profile loaded:', header);

  console.group('Parsed tags');
  console.log('rXYZ:', rXYZ);
  console.log('gXYZ:', gXYZ);
  console.log('bXYZ:', bXYZ);
  console.log('wtpt:', wtpt);
  console.log('A2B0:', A2B0);
  console.log('A2B1:', A2B1);
  console.log('A2B2:', A2B2);
  console.log('B2A0:', B2A0);
  console.log('B2A1:', B2A1);
  console.log('B2A2:', B2A2);
  console.log('gamt:', gamt);
  console.groupEnd();



  return {
    header,
    tags: parsedTags, // Return all parsed tags
    rXYZ,
    gXYZ,
    bXYZ,
    wtpt,
    A2B0,
    A2B1,
    A2B2,
    B2A0,
    B2A1,
    B2A2,
    gamt,
  };
}