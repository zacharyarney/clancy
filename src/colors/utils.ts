import { Pixel } from './colorPalette';

export function getAverageColors(groupedPixels: Pixel[]): Pixel {
  const totalPixels = groupedPixels.length;
  const redSum = groupedPixels.reduce((sum, pixel) => {
    return sum + pixel[0];
  }, 0);
  const greenSum = groupedPixels.reduce((sum, pixel) => {
    return sum + pixel[1];
  }, 0);
  const blueSum = groupedPixels.reduce((sum, pixel) => {
    return sum + pixel[2];
  }, 0);

  return [
    Math.round(redSum / totalPixels),
    Math.round(greenSum / totalPixels),
    Math.round(blueSum / totalPixels),
  ];
}

export function getPixelHashKey(pixel: Pixel, dimensions: number) {
  const redSector = Math.floor(pixel[0] / dimensions);
  const greenSector = Math.floor(pixel[1] / dimensions);
  const blueSector = Math.floor(pixel[2] / dimensions);

  return `${redSector}_${greenSector}_${blueSector}`;
}
