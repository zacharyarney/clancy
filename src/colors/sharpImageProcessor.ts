import sharp from 'sharp';

type channelString = 'red' | 'green' | 'blue';

export interface IImageProcessor {
  getChannel(channel: channelString): Promise<Uint8ClampedArray>;
}

class SharpImageProcessor implements IImageProcessor {
  imageUrl: string;

  constructor(imageUrl: string) {
    this.imageUrl = imageUrl;
  }

  async getChannel(channel: channelString) {
    const channelData = await sharp(this.imageUrl)
      .extractChannel(channel)
      .raw()
      .toBuffer();
    return new Uint8ClampedArray(channelData);
  }
}

export default SharpImageProcessor;
