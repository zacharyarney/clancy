import sharp from 'sharp';
import Histogram from './histogram';

type channelString = 'red' | 'green' | 'blue';

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
  imageUrl: string;
  colorChannels: ColorChannels = [
    new Uint8ClampedArray(),
    new Uint8ClampedArray(),
    new Uint8ClampedArray(),
  ];
  algorithm: PaletteAlgorithm;
  histogram: Pixel[] = [];

  constructor(imageUrl: string) {
    this.imageUrl = imageUrl;
    this.algorithm = new Histogram();
  }

  async loadHistogram(dimensions = 3, paletteSize = 10) {
    await this.loadChannels();
    this.algorithm = new Histogram(paletteSize, dimensions);
    this.histogram = this.algorithm.buildPalette(this.colorChannels);
  }

  async loadChannels() {
    try {
      const red: Uint8ClampedArray = await this.getChannel('red');
      const green: Uint8ClampedArray = await this.getChannel('green');
      const blue: Uint8ClampedArray = await this.getChannel('blue');

      this.colorChannels = [red, green, blue];
    } catch (error) {
      console.error(error);
    }
  }

  async getChannel(channel: channelString) {
    const channelData = await sharp(this.imageUrl)
      .extractChannel(channel)
      .raw()
      .toBuffer();
    return new Uint8ClampedArray(channelData);
  }
}

export default ColorPalette;
