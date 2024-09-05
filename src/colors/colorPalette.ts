import Histogram from './histogram';
import KMeans from './kmeans/index';
import SharpImageProcessor, { IImageProcessor } from './sharpImageProcessor';

type redValue = Uint8ClampedArray;
type greenValue = Uint8ClampedArray;
type blueValue = Uint8ClampedArray;

export interface Pixel {
  r: number;
  g: number;
  b: number;
}

export type ColorChannels = [redValue, greenValue, blueValue];

export interface PaletteAlgorithm {
  buildPalette(channels: ColorChannels): Pixel[];
}

class ColorPalette {
  imageProcessor: IImageProcessor;
  colorChannels: ColorChannels = [
    new Uint8ClampedArray(),
    new Uint8ClampedArray(),
    new Uint8ClampedArray(),
  ];
  uniqueColors = -1;
  colorChannelsAreLoaded = false;
  histogram: Pixel[] = [];
  kMeans: Pixel[] = [];

  constructor(imageUrl: string) {
    this.imageProcessor = new SharpImageProcessor(imageUrl);
  }

  async loadHistogram(paletteSize = 8, dimensions = 3) {
    await this.loadChannels();
    this.histogram = new Histogram(
      Math.min(this.uniqueColors, paletteSize),
      dimensions
    ).buildPalette(this.colorChannels);
  }

  async loadKMeans(paletteSize = 8) {
    await this.loadChannels();
    this.kMeans = new KMeans(
      Math.min(this.uniqueColors, paletteSize)
    ).buildPalette(this.colorChannels);
  }

  async loadChannels() {
    if (!this.colorChannelsAreLoaded) {
      try {
        const [r, g, b] = await Promise.all([
          this.imageProcessor.getChannel('red'),
          this.imageProcessor.getChannel('green'),
          this.imageProcessor.getChannel('blue'),
        ]);

        this.colorChannels = [r, g, b];
        this.colorChannelsAreLoaded = true;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to load color channels');
      }
    }
    if (this.uniqueColors < 0) {
      const uniqueColors = new Set<string>();
      for (let i = 0; i < this.colorChannels[0].length; i++) {
        const key = `${this.colorChannels[0][i]}_${this.colorChannels[1][i]}_${this.colorChannels[2][i]}`;
        uniqueColors.add(key);
      }

      this.uniqueColors = uniqueColors.size;
    }
  }
}

export default ColorPalette;
