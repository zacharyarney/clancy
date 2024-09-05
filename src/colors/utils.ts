import { Pixel } from './colorPalette';

export function getAverageColors(groupedPixels: Pixel[]): Pixel {
  const totalPixels = groupedPixels.length;
  const redSum = groupedPixels.reduce((sum, pixel) => {
    return sum + pixel.r;
  }, 0);
  const greenSum = groupedPixels.reduce((sum, pixel) => {
    return sum + pixel.g;
  }, 0);
  const blueSum = groupedPixels.reduce((sum, pixel) => {
    return sum + pixel.b;
  }, 0);

  return {
    r: Math.round(redSum / totalPixels),
    g: Math.round(greenSum / totalPixels),
    b: Math.round(blueSum / totalPixels),
  };
}

export function getPixelHashKey(pixel: Pixel, dimensions: number) {
  const redSector = Math.floor(pixel.r / dimensions);
  const greenSector = Math.floor(pixel.g / dimensions);
  const blueSector = Math.floor(pixel.b / dimensions);

  return `${redSector}_${greenSector}_${blueSector}`;
}
