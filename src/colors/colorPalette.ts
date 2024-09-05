import Histogram from './histogram';
import SharpImageProcessor from './imageProcessing/index';
import KMeans from './kmeans';

type redValue = Uint8ClampedArray;
type greenValue = Uint8ClampedArray;
type blueValue = Uint8ClampedArray;
export type ColorChannels = [redValue, greenValue, blueValue];
export type channelString = 'red' | 'green' | 'blue';

export type Pixel = [number, number, number];

export interface IImageProcessor {
  getChannel(channel: channelString): Promise<Uint8ClampedArray>;
}

export interface PaletteAlgorithm {
  buildPalette(channels: ColorChannels): Pixel[];
}

class ColorPalette {
  protected imageProcessor: IImageProcessor;
  private colorChannels: ColorChannels = [
    new Uint8ClampedArray(),
    new Uint8ClampedArray(),
    new Uint8ClampedArray(),
  ];
  private colorChannelsAreLoaded = false;
  public uniqueColors = -1;
  public histogram: Pixel[] = [];
  public kMeans: Pixel[] = [];

  constructor(imageUrl: string) {
    this.imageProcessor = new SharpImageProcessor(imageUrl);
  }

  public async loadHistogram(paletteSize = 8, dimensions = 3) {
    await this.loadChannels();
    this.histogram = new Histogram(
      Math.min(this.uniqueColors, paletteSize),
      dimensions
    ).buildPalette(this.colorChannels);
  }

  public async loadKMeans(paletteSize = 8) {
    await this.loadChannels();
    this.kMeans = new KMeans(
      Math.min(this.uniqueColors, paletteSize)
    ).buildPalette(this.colorChannels);
  }

  public async loadChannels() {
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
