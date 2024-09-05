import sharp from 'sharp';
import { channelString, IImageProcessor } from '../colorPalette';

class SharpImageProcessor implements IImageProcessor {
  private readonly imageUrl: string;

  constructor(imageUrl: string) {
    this.imageUrl = imageUrl;
  }

  public async getChannel(channel: channelString) {
    const channelData = await sharp(this.imageUrl)
      .extractChannel(channel)
      .raw()
      .toBuffer();
    return new Uint8ClampedArray(channelData);
  }
}

export default SharpImageProcessor;
