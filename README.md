# clancy

A library for deriving non-image data from image files.

## Installation

```npm install clancy```

## Usage

Loading a color palette is an asynchronous operation. You can either await the `loadHistogram` method or use `then` to
access the palette once it has been loaded.

```javascript
const { ColorPalette } = require('clancy');

async function getPalette() {
  const palette = new ColorPalette('path/to/image');
  await palette.loadHistogram();

  return palette.histogram;
}
```

### Histogram

The histogram algorithm sorts the pixels in an image into sectors in a 3D grid based on their RGB values. The output is
the average RGB value for each sector in order of sector density.

Some reasonable default parameters are provided for the histogram generation process. The number of sectors can be
increased using the `dimensionscs` parameter for greater color accuracy and the size of the color palette can be
adjusted with the `paletteSize` parameter.

## Todo

- [ ] Add more palette generation algorithms (k-means, median cut, etc.)
- [ ] Add support for transparency/alpha channels
- [ ] Add image to ASCII conversion
- [ ] Add browser support

## Notes

- Currently requires Node.js runtime. Browser support is on the todo list.
- Doesn't yet support transparency and will ignore alpha channels when generating color palette, meaning that the color
  palette will include RGB values for transparent pixels.
- The palette is stored as an array of objects with `r`, `g`, and `b` properties. This may be subject to change in the
  future.
