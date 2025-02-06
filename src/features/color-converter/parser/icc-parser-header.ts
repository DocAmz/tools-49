/**
  *   Header:     Contains metadata about the profile (e.g., size, version, color space, etc.).
  *   Tag Table:  Lists the tags (data blocks) in the profile and their offsets.
  *   Tag Data:   Contains the actual data for each tag (e.g., color lookup tables, curves, matrices, etc.).
*/

import { ICCProfileHeader } from "../types/headers";

export function parseICCProfileHeader(buffer: Buffer): ICCProfileHeader {
  return {
    size: buffer.readUInt32BE(0),
    cmmType: buffer.toString('ascii', 4, 8),
    version: `${buffer.readUInt8(8)}.${buffer.readUInt8(9)}.${buffer.readUInt16BE(10)}`,
    deviceClass: buffer.toString('ascii', 12, 16), // e.g., 'mntr' (monitor) or 'prtr' (printer)
    colorSpace: buffer.toString('ascii', 16, 20), // e.g., 'RGB ' or 'CMYK'
    pcs: buffer.toString('ascii', 20, 24), // Profile Connection Space (e.g., 'XYZ ')
    date: new Date(
      buffer.readUInt16BE(24), // Year
      buffer.readUInt8(26) - 1, // Month (0-based)
      buffer.readUInt8(27), // Day
      buffer.readUInt8(28), // Hour
      buffer.readUInt8(29), // Minute
      buffer.readUInt8(30) // Second
    ),
    signature: buffer.toString('ascii', 36, 40), // e.g., 'acsp' (Apple ColorSync Profile)
    platform: buffer.toString('ascii', 40, 44), // e.g., 'APPL' (Apple) or 'MSFT' (Microsoft)
    flags: buffer.readUInt32BE(44), // e.g., embedded, independent, etc. 0 = embedded, 1 = independent
    manufacturer: buffer.toString('ascii', 48, 52), // e.g., 'appl' (Apple)
    model: buffer.toString('ascii', 52, 56), // e.g., '\x00\x00\x00\x00' (Generic RGB) or 'RGB ' (Generic RGB) or 'CMYK' (Generic CMYK)
    attributes: (buffer.readUInt32BE(56) << 32) | buffer.readUInt32BE(60), // e.g., reflectance, transparency, matte, negative, etc. 0 = none
    renderingIntent: buffer.readUInt32BE(64),
    illuminant: [
      buffer.readUInt32BE(68) / 65536,
      buffer.readUInt32BE(72) / 65536,
      buffer.readUInt32BE(76) / 65536,
    ],
    creator: buffer.toString('ascii', 80, 84),
  };
}
