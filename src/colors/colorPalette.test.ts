import ColorPalette from './colorPalette';
import { IImageProcessor } from './sharpImageProcessor';

class TestableColorPalette extends ColorPalette {
  constructor(
    imageUrl: string,
    private mockImageProcessor: IImageProcessor
  ) {
    super(imageUrl);
    this.imageProcessor = this.imageProcessorInit();
  }

  protected imageProcessorInit(): IImageProcessor {
    return this.mockImageProcessor;
  }
}

describe('ColorPalette', () => {
  const defaultMockImageProcessor: IImageProcessor = {
    getChannel: jest.fn().mockImplementation(channel => {
      console.log('GET CHANNEL: ', channel);
      switch (channel) {
        case 'red':
          return Promise.resolve(
            new Uint8ClampedArray([255, 255, 255, 0, 0, 0, 255, 0])
          );
        case 'green':
          return Promise.resolve(
            new Uint8ClampedArray([0, 255, 0, 255, 255, 0, 255, 0])
          );
        case 'blue':
          return Promise.resolve(
            new Uint8ClampedArray([0, 0, 255, 0, 255, 255, 255, 0])
          );
        default:
          return Promise.reject(new Error('Unknown channel'));
      }
    }),
  };
  describe('loadHistogram', () => {
    let colorPalette: ColorPalette;
    let mockImageProcessor: IImageProcessor;

    beforeEach(() => {
      mockImageProcessor = defaultMockImageProcessor;
      colorPalette = new TestableColorPalette(
        'path/to/image.jpg',
        mockImageProcessor
      );
    });

    it('should correctly load color channels and build histogram', async () => {
      await colorPalette.loadHistogram();
      expect(colorPalette.histogram).toHaveLength(8);
      expect(colorPalette.histogram[0]).toEqual({ r: 255, g: 0, b: 0 });
      expect(colorPalette.histogram[1]).toEqual({ r: 255, g: 255, b: 0 });
      expect(colorPalette.histogram[2]).toEqual({ r: 255, g: 0, b: 255 });
      expect(colorPalette.histogram[3]).toEqual({ r: 0, g: 255, b: 0 });
      expect(colorPalette.histogram[4]).toEqual({ r: 0, g: 255, b: 255 });
      expect(colorPalette.histogram[5]).toEqual({ r: 0, g: 0, b: 255 });
      expect(colorPalette.histogram[6]).toEqual({ r: 255, g: 255, b: 255 });
      expect(colorPalette.histogram[7]).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('should adjust histogram based on custom dimensions and palette size', async () => {
      await colorPalette.loadHistogram(5, 5);
      expect(colorPalette.histogram).toHaveLength(5);
    });

    it('should create a histogram with default values when no dimensions and palette size are provided', async () => {
      await colorPalette.loadHistogram();
      expect(colorPalette.histogram).toHaveLength(8);
    });

    it('should return a palette with fewer colors when there are fewer unique colors than the palette size', async () => {
      mockImageProcessor = {
        getChannel: jest.fn().mockImplementation(channel => {
          switch (channel) {
            case 'red':
              return Promise.resolve(new Uint8ClampedArray([255, 0, 0]));
            case 'green':
              return Promise.resolve(new Uint8ClampedArray([0, 255, 0]));
            case 'blue':
              return Promise.resolve(new Uint8ClampedArray([0, 0, 255]));
            default:
              return Promise.reject(new Error('Unknown channel'));
          }
        }),
      };
      colorPalette = new TestableColorPalette(
        'path/to/image.jpg',
        mockImageProcessor
      );
      await colorPalette.loadHistogram();
      expect(colorPalette.histogram).toHaveLength(3);
    });

    it('should return a palette with one color when there is only one unique color', async () => {
      mockImageProcessor = {
        getChannel: jest.fn().mockImplementation(() => {
          return Promise.resolve(new Uint8ClampedArray([255, 255, 255]));
        }),
      };
      colorPalette = new TestableColorPalette(
        'path/to/image.jpg',
        mockImageProcessor
      );
      await colorPalette.loadHistogram();
      expect(colorPalette.histogram).toHaveLength(1);
    });

    it('should return an empty palette when no colors are provided', async () => {
      mockImageProcessor = {
        getChannel: jest.fn().mockImplementation(() => {
          return Promise.resolve(new Uint8ClampedArray());
        }),
      };
      colorPalette = new TestableColorPalette(
        'path/to/image.jpg',
        mockImageProcessor
      );
      await colorPalette.loadHistogram();
      expect(colorPalette.histogram).toHaveLength(0);
    });
  });

  describe('mock IImageProcessor usage', () => {
    let colorPalette: ColorPalette;
    let mockImageProcessor: IImageProcessor;

    beforeEach(async () => {
      mockImageProcessor = defaultMockImageProcessor;
      colorPalette = new TestableColorPalette(
        'path/to/image.jpg',
        mockImageProcessor
      );
      await colorPalette.loadChannels();
    });

    it('should call getChannel with "red"', () => {
      expect(mockImageProcessor.getChannel).toHaveBeenCalledWith('red');
    });

    it('should call getChannel with "green"', () => {
      expect(mockImageProcessor.getChannel).toHaveBeenCalledWith('green');
    });

    it('should call getChannel with "blue"', () => {
      expect(mockImageProcessor.getChannel).toHaveBeenCalledWith('blue');
    });
  });
});
