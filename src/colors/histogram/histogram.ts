import { ColorChannels, PaletteAlgorithm, Pixel } from '../colorPalette';
import { getAverageColors, getPixelHashKey } from '../utils';

type PixelHash = Record<string, Pixel[]>;
type Sector = [string, Pixel[]];

class Histogram implements PaletteAlgorithm {
  private readonly dimensions: number;
  private readonly paletteSize: number;

  constructor(paletteSize = 10, dimensions = 3) {
    this.dimensions = dimensions;
    this.paletteSize = paletteSize;
  }

  public buildPalette(channels: ColorChannels): Pixel[] {
    const pixelHash = this.groupPixels(channels);
    return this.loadSortedPalette(pixelHash);
  }

  private loadSortedPalette(pixelHash: PixelHash): Pixel[] {
    const palette: Pixel[] = [];
    const sectorOrder: Sector[] = Object.entries(pixelHash).sort((a, b) => {
      return b[1].length - a[1].length;
    });

    for (let i = 0; i < this.paletteSize; i++) {
      const sector = sectorOrder[i][1];
      const averageColor = getAverageColors(sector);
      palette.push(averageColor);
    }

    return palette;
  }

  private groupPixels(channels: ColorChannels): PixelHash {
    const pixelHash: PixelHash = {};
    const [redChannel, greenChannel, blueChannel] = channels;
    for (let i = 0; i < redChannel.length; i++) {
      const r = redChannel[i];
      const g = greenChannel[i];
      const b = blueChannel[i];

      const key = getPixelHashKey([r, g, b], this.dimensions);

      if (key in pixelHash) {
        pixelHash[key].push([r, g, b]);
      } else {
        pixelHash[key] = [[r, g, b]];
      }
    }

    return pixelHash;
  }
}

export default Histogram;
