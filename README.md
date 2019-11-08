# vtflib.js

Create, edit and modify VTF files.

Code heavily based on VTFLIb by Nemesis.

## Usage

```js
const { VTFFile, VTFImageFormatType } = require(".");
const { readFileSync, writeFileSync } = require("fs");

let readdata = new VTFFile(readFileSync("./in.vtf"));

let image = readdata.getImages().reverse()[0];

// image.toRGBA8888()

readdata.setImage(image.convert(VTFImageFormatType.IMAGE_FORMAT_DXT5));

writeFileSync("./out.vtf", readdata.toBuffer());
```
