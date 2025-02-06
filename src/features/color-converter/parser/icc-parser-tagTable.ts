import { ICCTag } from "../types/tags";

export function parseICCTagTable(buffer: Buffer, offset: number, count: number): ICCTag[] {
  const tags: ICCTag[] = [];
  for (let i = 0; i < count; i++) {
    const tagOffset = offset + i * 12;
    tags.push({
      signature: buffer.toString('ascii', tagOffset, tagOffset + 4),
      offset: buffer.readUInt32BE(tagOffset + 4),
      size: buffer.readUInt32BE(tagOffset + 8),
    });
  }
  return tags;
}