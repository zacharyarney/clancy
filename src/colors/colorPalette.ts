import sharp from 'sharp';

class ColorPalette {
  imageUrl: string;
  redChannel: Uint8ClampedArray = new Uint8ClampedArray();
  greenChannel: Uint8ClampedArray = new Uint8ClampedArray();
  blueChannel: Uint8ClampedArray = new Uint8ClampedArray();

  constructor(imageUrl: string) {
    this.imageUrl = imageUrl;
  }

  async loadChannels() {
    try {
      const red = await sharp(this.imageUrl).
        extractChannel('red').
        raw().
        toBuffer();
      const green = await sharp(this.imageUrl).
        extractChannel('green').
        raw().
        toBuffer();
      const blue = await sharp(this.imageUrl).
        extractChannel('blue').
        raw().
        toBuffer();

      this.redChannel = new Uint8ClampedArray(red.buffer);
      this.greenChannel = new Uint8ClampedArray(green.buffer);
      this.blueChannel = new Uint8ClampedArray(blue.buffer);
    } catch (error) {
      console.error(error);
    }
  }
}

export default ColorPalette;