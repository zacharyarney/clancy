import {ColorChannels, PaletteAlgorithm, Pixel} from '../colorPalette';

type PixelHash = Record<string, Pixel[]>;
type Sector = [string, Pixel[]];

class Histogram implements PaletteAlgorithm {
  dimensions: number;
  paletteSize: number;

  constructor(paletteSize = 10, dimensions = 3) {
    this.dimensions = dimensions;
    this.paletteSize = paletteSize;
  }

  buildPalette(channels: ColorChannels): Pixel[] {
    const pixelHash = this.groupPixels(channels);
    return this.loadSortedPalette(pixelHash);
  }

  loadSortedPalette(pixelHash: PixelHash): Pixel[] {
    const palette: Pixel[] = [];
    const sectorOrder: Sector[] = Object.entries(pixelHash).sort((a, b) => {
      return b[1].length - a[1].length;
    });
    const paletteSize = sectorOrder.length > this.paletteSize
      ? this.paletteSize
      : sectorOrder.length;

    for (let i = 0; i < paletteSize; i++) {
      const sector = sectorOrder[i][1];
      const averageColor = this.getAverageColors(sector);
      palette.push(averageColor);
    }

    return palette;
  }

  groupPixels(channels: ColorChannels): PixelHash {
    const pixelHash: PixelHash = {};
    const [redChannel, greenChannel, blueChannel] = channels;
    for (let i = 0; i < redChannel.length; i++) {
      const r = redChannel[i];
      const g = greenChannel[i];
      const b = blueChannel[i];

      const key = this.getPixelHashKey({r, g, b});

      if (key in pixelHash) {
        pixelHash[key].push({r, g, b});
      } else {
        pixelHash[key] = [{r, g, b}];
      }
    }

    return pixelHash;
  }

  getPixelHashKey(pixel: Pixel) {
    const redSector = Math.floor(pixel.r / this.dimensions);
    const greenSector = Math.floor(pixel.g / this.dimensions);
    const blueSector = Math.floor(pixel.b / this.dimensions);

    return `${redSector}_${greenSector}_${blueSector}`;
  }

  getAverageColors(groupedPixels: Pixel[]): Pixel {
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
}

export default Histogram;
