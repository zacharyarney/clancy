import sharp from 'sharp';
import Histogram from './Histogram';

type InputImage =
  | Buffer
  | ArrayBuffer
  | Uint8Array
  | Uint8ClampedArray
  | Int8Array
  | Uint16Array
  | Int16Array
  | Uint32Array
  | Int32Array
  | Float32Array
  | Float64Array
  | string;

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
  image: InputImage;
  colorChannels: ColorChannels = [
    new Uint8ClampedArray(),
    new Uint8ClampedArray(),
    new Uint8ClampedArray(),
  ];
  histogram: Pixel[] = [];
  kMeans: Pixel[] = [];

  constructor(image: InputImage) {
    this.image = image;
  }

  async getHistogram() {
    if (this.histogram.length === 0) {
      await this.loadHistogram();
    }

    return this.histogram;
  }

  async loadHistogram(dimensions = 3, paletteSize = 10) {
    await this.loadChannels();
    const algorithm = new Histogram(paletteSize, dimensions);
    this.histogram = algorithm.buildPalette(this.colorChannels);
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
    const channelData = await sharp(this.image)
      .extractChannel(channel)
      .raw()
      .toBuffer();
    return new Uint8ClampedArray(channelData);
  }
}

export default ColorPalette;
