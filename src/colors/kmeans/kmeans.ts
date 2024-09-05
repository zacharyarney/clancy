import { ColorChannels, PaletteAlgorithm, Pixel } from '../colorPalette';
import { getAverageColors } from '../utils';

class KMeans implements PaletteAlgorithm {
  private readonly paletteSize: number;

  constructor(paletteSize = 10) {
    this.paletteSize = paletteSize;
  }

  public buildPalette(channels: ColorChannels): Pixel[] {
    const centroids = this.getInitialCentroids(channels);
    return this.cluster(centroids, channels);
  }

  private cluster(initialCentroids: Pixel[], channels: ColorChannels): Pixel[] {
    let centroids = initialCentroids;
    let newCentroids = initialCentroids;

    do {
      const groups = this.groupPixels(centroids, channels);
      centroids = newCentroids;
      newCentroids = groups.map(group => getAverageColors(group));
    } while (this.centroidsDidMove(centroids, newCentroids));

    return centroids;
  }

  private centroidsDidMove(centroidsA: Pixel[], centroidsB: Pixel[]): boolean {
    if (centroidsA.length !== centroidsB.length) {
      return true;
    }

    for (let i = 0; i < centroidsA.length; i++) {
      const a = centroidsA[i];
      const b = centroidsB[i];

      if (a[0] !== b[0] || a[1] !== b[1] || a[2] !== b[2]) {
        return true;
      }
    }
    return false;
  }

  private getInitialCentroids(channels: ColorChannels): Pixel[] {
    const centroids: Pixel[] = [];
    const checkSet = new Set<string>();

    while (centroids.length < this.paletteSize) {
      const index = Math.floor(Math.random() * channels[0].length);
      const centroid: Pixel = [
        channels[0][index],
        channels[1][index],
        channels[2][index],
      ];
      // avoid duplicates
      const checkString = `${centroid[0]}_${centroid[1]}_${centroid[2]}`;

      if (!checkSet.has(checkString)) {
        centroids.push(centroid);
        checkSet.add(checkString);
      }
    }
    return centroids;
  }

  private groupPixels(centroids: Pixel[], channels: ColorChannels): Pixel[][] {
    const groups: Pixel[][] = Array.from(Array(centroids.length), () => []);
    const red = channels[0];
    const green = channels[1];
    const blue = channels[2];

    for (let i = 0; i < red.length; i++) {
      let centroidIndex = 0;
      let diff = Infinity;

      for (let j = 0; j < centroids.length; j++) {
        const [r, g, b] = centroids[j];
        const newDiff = Math.sqrt(
          Math.pow(red[i] - r, 2) +
            Math.pow(green[i] - g, 2) +
            Math.pow(blue[i] - b, 2)
        );

        if (newDiff < diff) {
          diff = newDiff;
          centroidIndex = j;
        }
      }

      groups[centroidIndex].push([red[i], green[i], blue[i]]);
    }

    return groups;
  }
}

export default KMeans;
