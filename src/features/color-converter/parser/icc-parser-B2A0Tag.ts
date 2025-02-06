import { B2A0Tag } from "../types/tags";
import { parseMFT1Tag } from "./icc-parser-mft1";
import { parseMFT2Tag } from "./icc-parser-mft2";

/**
 * Parse the B2A0 tag data from the buffer.
 * @param buffer - Buffer containing the B2A0 tag data.
 * @returns Parsed B2A0 tag data.
 */

export function parseB2A0Tag(buffer: Buffer): B2A0Tag {
  console.log('Parsing B2A0 tag');
  console.log('Buffer size:', buffer.length);

  // Validate minimu b uffer size
  if(buffer.length < 16) {
    throw new Error(`Invalid B2A0 tag: Buffer too small (${buffer.length} bytes)`);
  }

    // --- Signature Check ---
    const signature = buffer.toString('ascii', 0, 4);
    console.log(`B2A0 Signature Detected: ${signature}`);

    if (signature !== 'mft1' && signature !== 'mft2') {
      throw new Error(`Unknown B2A0 format: Expected 'mft1' or 'mft2', found '${signature}'`);
    }

    let offset = 4;

    // --- Shared Header Parsing ---
  const version = buffer.readUInt32BE(offset);
  offset += 4;
  const flags = buffer.readUInt32BE(offset);
  offset += 4;
  const inputChannels = Math.max(1, buffer.readUInt8(offset));
  const outputChannels = Math.max(1, buffer.readUInt8(offset + 1));
  offset += 4; // Skip reserved bytes

  console.log(`Channels: Input=${inputChannels}, Output=${outputChannels}`);


  // **Switch Parsing Logic Based on Signature**
  if (signature === 'mft1') {
    return parseMFT1Tag(buffer, offset, inputChannels, outputChannels);
  } else {
    return parseMFT2Tag(buffer, offset, inputChannels, outputChannels);
  }

}

// Debugging helper function
export function debugB2A0Tag(buffer: Buffer) {
  try {
    const parsedTag = parseB2A0Tag(buffer);
    console.log('Successfully parsed B2A0 tag');
    return parsedTag;
  } catch (error) {
    console.error('Parsing failed:', error);

    // Detailed buffer analysis
    console.log('Buffer Analysis:');
    console.log('Total Size:', buffer.length);
    console.log('First 256 bytes (hex):', buffer.slice(0, 256).toString('hex'));

    // Check for common issues
    if (buffer.length < 16) {
      console.warn('Buffer is too small');
    }

    const signature = buffer.toString('ascii', 0, 4);
    console.log('Signature:', signature);

    return null;
  }
}