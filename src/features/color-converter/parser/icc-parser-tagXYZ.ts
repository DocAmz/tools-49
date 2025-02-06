export function parseXYZTag(buffer: Buffer, offset: number): [number, number, number] {
  return [
    buffer.readUInt32BE(offset) / 65536, // X
    buffer.readUInt32BE(offset + 4) / 65536, // Y
    buffer.readUInt32BE(offset + 8) / 65536, // Z
  ];
}