import Histogram from './histogram';
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
  algorithm: PaletteAlgorithm;
  histogram: Pixel[] = [];

  constructor(imageUrl: string) {
    this.imageProcessor = this.imageProcessorInit(imageUrl);
    this.algorithm = new Histogram();
  }

  protected imageProcessorInit(imageUrl: string): IImageProcessor {
    return new SharpImageProcessor(imageUrl);
  }

  async loadHistogram(dimensions = 3, paletteSize = 8) {
    await this.loadChannels();
    const algorithm = new Histogram(paletteSize, dimensions);
    this.histogram = algorithm.buildPalette(this.colorChannels);
  }

  async loadChannels() {
    try {
      const r = await this.imageProcessor.getChannel('red');
      const g = await this.imageProcessor.getChannel('green');
      const b = await this.imageProcessor.getChannel('blue');

      this.colorChannels = [r, g, b];
    } catch (error) {
      console.error(error);
    }
  }
}

export default ColorPalette;
