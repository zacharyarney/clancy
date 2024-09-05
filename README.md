# clancy

A library for deriving color data from image files.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
    - [Examples](#examples)
    - [Histogram](#histogram)
    - [K-Means](#k-means)
- [API](#api)
- [Contributing](#contributing)
- [License](#license)
- [Notes](#notes)

## Installation

`npm install clancy`

## Usage

Loading a color palette is an asynchronous operation. You can either await the `loadHistogram` or `loadKMeans` methods or use `then` to access the palette once it has been loaded.

### Examples

#### Using `async/await`

```typescript
import { ColorPalette } from 'clancy';

async function getHistogram() {
  try {
    const palette = new ColorPalette('path/to/image');
    await palette.loadHistogram();
    console.log(palette.histogram);
  } catch (error) {
    console.error('Error loading histogram:', error);
  }
}

getHistogram();
```
#### Using Promises

```typescript
import { ColorPalette } from 'clancy';

function doSomethingWithPalette(colors: Pixel[]) {
  // ... do something with color palette
}

const palette = new ColorPalette('path/to/image');
palette.loadKMeans()
  .then(() => {
    doSomethingWithPalette(palette.kMeans);
  })
  .catch(error => {
    console.error('Error loading K-Means palette:', error);
  });
```

### Histogram

The histogram algorithm sorts the pixels in an image into sectors in a 3D grid based on their RGB values. The output is
the average RGB value for each sector in order of sector density.

Some reasonable default parameters are provided for the histogram generation process. The number of sectors can be
increased using the `dimensions` parameter for greater color accuracy and the size of the color palette can be adjusted
with the `paletteSize` parameter.

### K-Means

The k-means algorithm sorts the pixels in an image into groups based on randomly selected centroids or focal-points. The
pixels are grouped with the closest centroid (based on Euclidean distance), then the centroids are recalculated to be
the average color of their associated group. This grouping and recalculating process repeats until the centroids become
stable. The output is the final RGB values for each centroid.

K-Means generation only requires a `paletteSize` parameter and a default size of 8 is provided. The output
of `loadKMeans()` will change every time it is run because it depends on the random selection of initial centroids. This
random selection also means that the accuracy of the generated color palette will vary greatly depending on the initial
centroid picks. It may be beneficial to run `loadKMeans()` multiple times and compare the outputs to find the best one

## API

`ColorPalette` class: A class for generating color palettes from images.
`constructor(imageUrl: string)`: Initializes the ColorPalette with the given image URL.
`async loadHistogram(paletteSize = 8, dimensions = 3)`: Loads the histogram palette.
`async loadKMeans(paletteSize = 8)`: Loads the k-means palette.
`async loadChannels()`: Loads the color channels from the image.

## Contributing

Contributions are welcome! Please read the contributing guidelines first.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Notes

- Clancy currently requires Node.js runtime. Browser support is on the todo list.
- Doesn't yet support transparency and will ignore alpha channels when generating color palette, meaning that the color
  palette will include RGB values for transparent pixels which could lead to unexpected results when generating palettes
  for images with transparency.
- The palette is stored as an array of `Pixels`. A `Pixel` is represented as an array with a length of 3
  where `pixel[0]` is the red value, `pixel[1]` is the green value, and `pixel[2]` is the blue value. This may be
  subject to change in the future.

### Todo

- [ ] Add more palette generation algorithms (~~k-means~~, median cut, etc.)
- [ ] Add support for transparency/alpha channels
- [ ] Add image to ASCII conversion
- [ ] Add browser support
