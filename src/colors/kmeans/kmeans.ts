import { ColorChannels, PaletteAlgorithm, Pixel } from '../colorPalette';

type PixelMap = Map<string, Pixel[]>;

class Kmeans implements PaletteAlgorithm {
  paletteSize: number;

  constructor(paletteSize = 10) {
    this.paletteSize = paletteSize;
  }

  buildPalette(channels: ColorChannels): Pixel[] {
    const centroids = this.getInitialCentroids(channels);
    return this.cluster(centroids, channels);
  }

  cluster(initialCentroids: Pixel[], channels: ColorChannels): Pixel[] {
    let centroids = initialCentroids;
    let newCentroids: Pixel[] = [];

    while (this.centroidsDidMove(centroids, newCentroids)) {
      const groups = this.groupPixels(centroids, channels);
      centroids = newCentroids;
      const averages: Pixel[] = [];
      for (const group of groups.values()) {
        averages.push(this.getAverageColors(group));
      }
      newCentroids = averages;
    }
    return centroids;
  }

  centroidsDidMove(centroidsA: Pixel[], centroidsB: Pixel[]): boolean {
    if (centroidsA.length !== centroidsB.length) {
      return true;
    }

    for (let i = 0; i < centroidsA.length; i++) {
      const a = centroidsA[i];
      const b = centroidsB[i];

      if (a.r === b.r && a.g === b.g && a.b === b.b) {
        return false;
      }
    }
    return true;
  }

  getAverageColors(groupedPixels: Pixel[]): Pixel {
    const totalPixels = groupedPixels.length;
    const redSum = groupedPixels.reduce((sum, pixel) => {
      return sum + pixel.r;
    }, 0);
    const greenSum = groupedPixels.reduce((sum, pixel) => {
      return sum + pixel.g;
    }, 0);
    const blueSum = groupedPixels.reduce((sum, pixel) => {
      return sum + pixel.b;
    }, 0);

    return {
      r: Math.round(redSum / totalPixels),
      g: Math.round(greenSum / totalPixels),
      b: Math.round(blueSum / totalPixels),
    };
  }

  getInitialCentroids(channels: ColorChannels): Pixel[] {
    const centroids: Pixel[] = [];
    const checkSet = new Set<string>();

    while (centroids.length < this.paletteSize) {
      const index = Math.floor(Math.random() * channels.length);
      const centroid: Pixel = {
        r: channels[0][index],
        g: channels[1][index],
        b: channels[2][index],
      };
      // avoid duplicates
      const checkString = `${centroid.r}_${centroid.g}_${centroid.b}`;

      if (!checkSet.has(checkString)) {
        centroids.push(centroid);
      }
      checkSet.add(checkString);
    }
    return centroids;
  }

  groupPixels(centroids: Pixel[], channels: ColorChannels): PixelMap {
    const centroidStrings = centroids.map(c => `${c.r}_${c.g}_${c.b}`);
    const pixelMap: PixelMap = new Map(centroidStrings.map(str => [str, []]));
    const red = channels[0];
    const green = channels[1];
    const blue = channels[2];

    for (let i = 0; i < red.length; i++) {
      let centroidStr = centroidStrings[0];
      let diff = Infinity;

      for (let j = 0; j < centroids.length; j++) {
        const { r, g, b } = centroids[j];
        const newDiff =
          Math.abs(red[i] - r) + Math.abs(green[i] - g) + Math.abs(blue[i] - b);

        if (newDiff < diff) {
          diff = newDiff;
          centroidStr = centroidStrings[j];
        }
      }

      pixelMap.get(centroidStr)?.push({ r: red[i], g: green[i], b: blue[i] });
    }

    return pixelMap;
  }
}

export default Kmeans;
