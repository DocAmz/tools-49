/**
 *  diffImage.ts
 * @desc This file contains the logic to compare two images and generate a diff image.
 * inspired by @pixelmatch
 * @see https://github.com/mapbox/pixelmatch/tree/main
 *
 * author: @DocAmz
 * date : 2024-12-20
 * version: 1.0.0
 */

export type TOptions = {
  threshold: number;
  includeAA: boolean;
  alpha: number;
  aaColor: number[]
  diffColor: number[]
  diffColorAlt: number[] | null;
  diffMask: boolean;
}

/**
 * @constant OPTIONS
 * @desc Default options for the image comparison
 * @type {TOptions}
 * @default
 *
 * @param threshold matching threshold (0 to 1); smaller is more sensitive
 * @param includeAA whether to skip anti-aliasing detection
 * @param alpha opacity of original image in diff output
 * @param aaColor color of anti-aliased pixels in diff output
 * @param diffColor color of different pixels in diff output
 * @param diffColorAlt whether to detect dark on light differences between img1 and img2 and set an alternative color to differentiate between the two
 * @param diffMask draw the diff over a transparent background (a mask)
 *
 */

const OPTIONS: TOptions =  {
  threshold: 0.1,
  includeAA: true,
  alpha: 0.5,
  aaColor: [255, 255, 0],
  diffColor: [255, 0, 0],
  diffColorAlt: null,
  diffMask: false,
}

export default function diffImagePixelMatcher(
    image1: Uint8ClampedArray | Buffer,
    image2: Uint8ClampedArray | Buffer,
    output: Uint8ClampedArray | Buffer,
    width: number,
    height: number,
    options: TOptions
  )
  {

    validateImage(image1, image2, output, width, height);

    options = Object.assign({}, OPTIONS, options) as TOptions;

    const len = width * height;
    const a32 = new Uint32Array(image1.buffer, image1.byteOffset, len);
    const b32 = new Uint32Array(image2.buffer, image2.byteOffset, len);

    let match = true;

    // check if images match
    for(let i = 0; i < len; i++) {
      if (a32[1] !== b32[i]) { match = false; break; }
    }

    // if images match fast resolve
    if(match) {
      if(output && !options.diffMask) {
        for (let i = 0; i < len ;i++ ) drawGrayPixel(image1, 4 * i, options.alpha, output);
      }
      return 0;
    }

    // maximum acceptable square distance between two colors;
    // 35215 is the maximum possible value for the YIQ difference metric

    const maxDelta = 35215 * options.threshold * options.threshold;
    const [aaR, aaG, aaB] = options.aaColor;
    const [diffR, diffG, diffB] = options.diffColor;
    const [altR, altG, altB] = options.diffColorAlt || options.diffColor;
    let diff = 0

    // compare each pixel of one image against the other one
    for (let y = 0; y < height; y++) {
      for(let x = 0; x < width; x++) {

        const pos = (y * width + x) * 4

        //squared YUV distance between colors at this pixel position, negative if the image2 pixel is darker
        const delta = colorDelta(image1, image2, pos, pos);

        // the color difference is above the threshold
        if(Math.abs(delta) > maxDelta) {
          // check it's a real rendering difference or just anti-aliasing
          if(!options.includeAA && (isAntialiased(image1, x, y, width, height, image2) || isAntialiased(image2, x, y, width, height, image1))) {
            // it's anti-aliasing
            // one of the pixels is anti-aliasing; draw as yellow and do not count as difference in the diff count
            // note that we do not include such pixels in a mask (diffMask = true)
            if(output && !options.diffMask) drawPixel(output, pos, aaR, aaG, aaB);
          } else {
            // found substantial difference not caused by anti-aliasing; draw it as such
            if(output) {
              if(delta < 0) {
                drawPixel(output, pos, altR, altG, altB);
              } else {
                drawPixel(output, pos, diffR, diffG, diffB);
              }
            }
            diff++;
          }
        } else if(output) {
          // pixels are similar; draw background as grayscale image blended with white
          if (!options.diffMask) drawGrayPixel(image1, pos, options.alpha, output);
        }
      }
    }

    return diff;
}

function isPixelData(arr: Uint8ClampedArray | Buffer): boolean {
  return ArrayBuffer.isView(arr) && (arr.constructor as Uint8ClampedArrayConstructor).BYTES_PER_ELEMENT === 1;
}

function validateImage(image1: Uint8ClampedArray | Buffer, image2: Uint8ClampedArray | Buffer, output: Uint8ClampedArray | Buffer, width: number, height: number) {
  if(!isPixelData(image1)) {
    throw new Error('image1 must be a Uint8ClampedArray or Buffer expected');
  }

  if(!isPixelData(image2)) {
    throw new Error('image2 must be a Uint8ClampedArray or Buffer expected');
  }

  if(output && !isPixelData(output)) {
    throw new Error('output must be a Uint8ClampedArray or Buffer expected');
  }

  if(image1.length !== image2.length) {
    throw new Error('image1 and image2 must have the same size');
  }

  if(output && output.length !== image1.length) {
    throw new Error('image1 and output must have the same size');
  }

  if(image1.length !== width * height * 4) {
    throw new Error('Image data size does not match width/height.');
  }
}

/**
 * Converts RGB color values to luminance (Y) component.
 *
 * The Y component represents the brightness (luminance) of a color
 * based on the human visual system's sensitivity to red, green,
 * and blue light.
 *
 * Formula:
 * Y = 0.29889531 * R + 0.58662247 * G + 0.11448223 * B
 *
 * These weights are derived from the ITU-R BT.601 standard for
 * converting RGB to grayscale, tuned to human perception.
 *
 * @param r - Red component (0-255).
 * @param g - Green component (0-255).
 * @param b - Blue component (0-255).
 * @returns The brightness (luminance) value.
 */
function rgb2y(r: number, g: number, b: number): number {
  return r * 0.29889531 + g * 0.58662247 + b * 0.11448223;
}

/**
* Converts RGB color values to the I chromaticity component.
*
* The I component represents the orange-cyan axis in a perceptual
* color space. It captures differences between red and a combination
* of green and blue, which are visually perceived as orange vs. cyan.
*
* Formula:
* I = 0.59597799 * R - 0.27417610 * G - 0.32180189 * B
*
* This transformation is derived from the YIQ color space.
*
* @param r - Red component (0-255).
* @param g - Green component (0-255).
* @param b - Blue component (0-255).
* @returns The chromaticity value along the orange-cyan axis.
*/
function rgb2i(r: number, g: number, b: number): number {
  return r * 0.59597799 - g * 0.27417610 - b * 0.32180189;
}

/**
* Converts RGB color values to the Q chromaticity component.
*
* The Q component represents the purple-green axis in a perceptual
* color space. It captures differences between blue and a combination
* of red and green, which are visually perceived as purple vs. green.
*
* Formula:
* Q = 0.21147017 * R - 0.52261711 * G + 0.31114694 * B
*
* This transformation is derived from the YIQ color space.
*
* @param r - Red component (0-255).
* @param g - Green component (0-255).
* @param b - Blue component (0-255).
* @returns The chromaticity value along the purple-green axis.
*/
function rgb2q(r: number, g: number, b: number): number {
  return r * 0.21147017 - g * 0.52261711 + b * 0.31114694;
}

// blend semi-transparent color with white
function blend(c: number , a: number ) {
  return 255 + (c - 255) * a;
}

/**
 * Draws a grayscale pixel on the output image.
 *
 * This function calculates the grayscale intensity of a pixel from the input image,
 * blends it with transparency (alpha), and writes the resulting grayscale value
 * as an RGB pixel to the output image.
 *
 * @param image - The source image pixel data in RGBA format.
 * @param i - The index of the pixel in the input image (starting position of RGBA values).
 * @param alpha - The alpha multiplier (transparency factor) to blend the pixel's grayscale value.
 * @param output - The output image buffer where the grayscale pixel will be written.
 */
function drawGrayPixel(
  image: Uint8ClampedArray | Buffer,
  i: number,
  alpha: number,
  output: Uint8ClampedArray | Buffer,
): void {
  // Extract the RGB values for the pixel at index `i` from the input image.
  const r = image[i + 0];
  const g = image[i + 1];
  const b = image[i + 2];

  // Calculate the grayscale value using the luminance formula (rgb2y),
  // then blend it with the pixel's transparency (alpha channel).
  const val = blend(rgb2y(r, g, b), alpha * image[i + 3] / 255);

  // Write the grayscale value as RGB to the output image.
  drawPixel(output, i, val, val, val);
}

/**
 * Writes an RGB pixel to the output image with full opacity.
 *
 * This function writes the specified red, green, and blue color values to the
 * given position in the output image. The alpha channel is set to 255 (fully opaque).
 *
 * @param output - The output image buffer where the pixel will be written.
 * @param pos - The index in the output image buffer (starting position of RGBA values).
 * @param r - The red component of the pixel (0-255).
 * @param g - The green component of the pixel (0-255).
 * @param b - The blue component of the pixel (0-255).
 */
function drawPixel(
  output: Uint8ClampedArray | Buffer,
  pos: number,
  r: number,
  g: number,
  b: number
): void {
  // Write the RGB color values to the specified position in the output image.
  output[pos + 0] = r; // Red channel
  output[pos + 1] = g; // Green channel
  output[pos + 2] = b; // Blue channel

  // Set the alpha channel to 255 (fully opaque).
  output[pos + 3] = 255;
}

/**
 * Computes the perceptual color difference between two pixels from two images.
 *
 * This function calculates the difference between two pixels in terms of luminance
 * (brightness) and chromaticity (color). It uses the YIQ color space, which is
 * designed to approximate human color perception. The output can include the full
 * perceptual difference or only the brightness difference if specified.
 *
 * @param image1 - Pixel data of the first image (RGBA format).
 * @param image2 - Pixel data of the second image (RGBA format).
 * @param k - Index of the pixel in the first image (starting position of RGBA values).
 * @param m - Index of the pixel in the second image (starting position of RGBA values).
 * @param yOnly - If true, computes only the brightness difference (luminance).
 *                Defaults to `false`.
 * @returns The perceptual color difference. The sign indicates whether the pixel
 *          in image 2 is lighter (positive) or darker (negative) than the pixel in
 *          image 1. If the pixels are identical, returns `0`.
 */
function colorDelta(
  image1: Uint8ClampedArray | Buffer,
  image2: Uint8ClampedArray | Buffer,
  k: number,
  m: number,
  yOnly: boolean = false
): number {
  // Extract RGBA values for the pixel at position `k` in image1.
  let r1 = image1[k + 0];
  let g1 = image1[k + 1];
  let b1 = image1[k + 2];
  let a1 = image1[k + 3];

  // Extract RGBA values for the pixel at position `m` in image2.
  let r2 = image2[m + 0];
  let g2 = image2[m + 1];
  let b2 = image2[m + 2];
  let a2 = image2[m + 3];

  // Check if the two pixels are identical. If so, return `0` (no difference).
  if (a1 === a2 && r1 === r2 && g1 === g2 && b1 === b2) return 0;

  // If a pixel's alpha value is less than 255 (not fully opaque), blend its color
  // values with the background (assumed to be black).
  if (a1 < 255) {
    a1 /= 255;
    r1 = blend(r1, a1);
    g1 = blend(g1, a1);
    b1 = blend(b1, a1);
  }

  if (a2 < 255) {
    a2 /= 255;
    r2 = blend(r2, a2);
    g2 = blend(g2, a2);
    b2 = blend(b2, a2);
  }

  // Calculate the brightness (luminance) of each pixel using the YIQ Y-component.
  const y1 = rgb2y(r1, g1, b1);
  const y2 = rgb2y(r2, g2, b2);

  // Compute the brightness difference between the two pixels.
  const y = y1 - y2;

  // If only brightness difference is required, return the luminance difference.
  if (yOnly) return y;

  // Calculate the chromaticity differences (orange-cyan and purple-green axes).
  const i = rgb2i(r1, g1, b1) - rgb2i(r2, g2, b2);
  const q = rgb2q(r1, g1, b1) - rgb2q(r2, g2, b2);

  // Compute the perceptual color difference using a weighted formula:
  // - Brightness difference (Y) is weighted at 0.5053.
  // - Orange-cyan chromaticity difference (I) is weighted at 0.299.
  // - Purple-green chromaticity difference (Q) is weighted at 0.1957.
  const delta = 0.5053 * y * y + 0.299 * i * i + 0.1957 * q * q;

  // Encode the brightness difference as the sign of the result:
  // - Negative result indicates that the pixel in image2 is darker.
  // - Positive result indicates that the pixel in image2 is lighter.
  const encode = y1 > y2 ? -delta : delta;

  return encode;
}

/**
 * Check if a pixel is anti-aliased.
 * @param image1
 * @param x1
 * @param y1
 * @param width
 * @param height
 * @param image2
 */
function isAntialiased(
  image1: Uint8ClampedArray | Buffer,
  x1: number,
  y1: number,
  width: number,
  height: number,
  image2: Uint8ClampedArray | Buffer,
) {
  const x0 = Math.max(x1 - 1, 0); // left
  const y0 = Math.max(y1 - 1, 0); // top
  const x2 = Math.min(x1 + 1, width - 1); // right
  const y2 = Math.min(y1 + 1, height - 1); // bottom

  const pos = (y1 * width + x1) * 4; // position of the pixel in image1

  let zeroes = x1 === x0 || x1 === x2 || y1 === y0 || y1 === y2 ? 1 : 0;
  let min = 0;
  let max = 0;
  let minX, minY, maxX, maxY;

  // got through the 8 neighboring pixels of the pixel at (x1, y1)

  for(let x = x0; x <= x2; x++) {
    for(let y = y0; y <= y2; y++) {
      if (x === x1 && y === y1) continue;

      // brightness difference between the center pixel and the neighboring pixel
      const delta = colorDelta(image1, image1, pos, (y * width + x) * 4, true);

      // keep track of the darkest and lightest neighboring pixel
      if(delta === 0) {
        zeroes++;
        // if found more than 2 pixels with the same brightness, it's not anti-aliased
        if(zeroes > 2) return false;

        // remember the darkest pixel
      } else if (delta < min) {
        min = delta;
        minX = x;
        minY = y;

        // remember the brightest pixel
      } else if (delta > max) {
        max = delta;
        maxX = x;
        maxY = y;
      }
    }
  }


  // if there are no both darker and brighter pixels among siblings, it's not anti-aliasing
  if(min === 0 || max === 0) return false;

    // if either the darkest or the brightest pixel has 3+ equal siblings in both images
    // (definitely not anti-aliased), this pixel is anti-aliased
    // @ts-ignore
    return (hasManySiblings(image1, minX, minY, width, height) && hasManySiblings(image2, minX, minY, width, height)) ||
    // @ts-ignore
            (hasManySiblings(image1, maxX, maxY, width, height) && hasManySiblings(image2, maxX, maxY, width, height));

}

/**
 * Check if a pixel has 3+ adjacent pixels of the same color.
 * @param image
 * @param x
 * @param y
 * @param width
 * @param height
 */

function  hasManySiblings(
  image: Uint8ClampedArray | Buffer,
  x1: number,
  y1: number,
  width: number,
  height: number
) {

  const x0 = Math.max(x1 - 1, 0);
  const y0 = Math.max(y1 - 1, 0);
  const x2 = Math.min(x1 + 1, width - 1);
  const y2 = Math.min(y1 + 1, height - 1);
  const pos = (y1 * width + x1) * 4;
  let zeroes = x1 === x0 || x1 === x2 || y1 === y0 || y1 === y2 ? 1 : 0;

  // go through 8 adjacent pixels
  for (let x = x0; x <= x2; x++) {
      for (let y = y0; y <= y2; y++) {
          if (x === x1 && y === y1) continue;

          const pos2 = (y * width + x) * 4;
          if (image[pos] === image[pos2] &&
              image[pos + 1] === image[pos2 + 1] &&
              image[pos + 2] === image[pos2 + 2] &&
              image[pos + 3] === image[pos2 + 3]) zeroes++;
          if (zeroes > 2) return true;
      }
  }

  return false;
}