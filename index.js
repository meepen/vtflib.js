const dxt = require("dxt-js");

exports.VTFResourceTypes = {
	LOW_RES_IMAGE: 1,
	IMAGE: 48, 
}

exports.VTFImageFormatTypeList = [
	"IMAGE_FORMAT_RGBA8888",
	"IMAGE_FORMAT_ABGR8888",
	"IMAGE_FORMAT_RGB888",
	"IMAGE_FORMAT_BGR888",
	"IMAGE_FORMAT_RGB565",
	"IMAGE_FORMAT_I8",
	"IMAGE_FORMAT_IA88",
	"IMAGE_FORMAT_P8",
	"IMAGE_FORMAT_A8",
	"IMAGE_FORMAT_RGB888_BLUESCREEN",
	"IMAGE_FORMAT_BGR888_BLUESCREEN",
	"IMAGE_FORMAT_ARGB8888",
	"IMAGE_FORMAT_BGRA8888",
	"IMAGE_FORMAT_DXT1",
	"IMAGE_FORMAT_DXT3",
	"IMAGE_FORMAT_DXT5",
	"IMAGE_FORMAT_BGRX8888",
	"IMAGE_FORMAT_BGR565",
	"IMAGE_FORMAT_BGRX5551",
	"IMAGE_FORMAT_BGRA4444",
	"IMAGE_FORMAT_DXT1_ONEBITALPHA",
	"IMAGE_FORMAT_BGRA5551",
	"IMAGE_FORMAT_UV88",
	"IMAGE_FORMAT_UVWQ8888",
	"IMAGE_FORMAT_RGBA16161616F",
	"IMAGE_FORMAT_RGBA16161616",
	"IMAGE_FORMAT_UVLX8888",
	"IMAGE_FORMAT_R32F",
	"IMAGE_FORMAT_RGB323232F",
	"IMAGE_FORMAT_RGBA32323232F",
	"IMAGE_FORMAT_NV_DST16",
	"IMAGE_FORMAT_NV_DST24",
	"IMAGE_FORMAT_NV_INTZ",
	"IMAGE_FORMAT_NV_RAWZ",
	"IMAGE_FORMAT_ATI_DST16",
	"IMAGE_FORMAT_ATI_DST24",
	"IMAGE_FORMAT_NV_NULL",
	"IMAGE_FORMAT_ATI2N",
	"IMAGE_FORMAT_ATI1N",
];

exports.VTFImageFormatType = Object.create(null);
for (let key in exports.VTFImageFormatTypeList) {
	exports.VTFImageFormatType[exports.VTFImageFormatTypeList[key]] = parseInt(key);
}

exports.VTFImageFormatType.IMAGE_FORMAT_NONE = 0xFFFFFFFF;

const VTFImageFormatInfo = [
	[ "RGBA8888",			 32,  4,  8,  8,  8,  8, false,  true ],		// IMAGE_FORMAT_RGBA8888,
	[ "ABGR8888",			 32,  4,  8,  8,  8,  8, false,  true ],		// IMAGE_FORMAT_ABGR8888, 
	[ "RGB888",				 24,  3,  8,  8,  8,  0, false,  true ],		// IMAGE_FORMAT_RGB888,
	[ "BGR888",				 24,  3,  8,  8,  8,  0, false,  true ],		// IMAGE_FORMAT_BGR888,
	[ "RGB565",				 16,  2,  5,  6,  5,  0, false,  true ],		// IMAGE_FORMAT_RGB565, 
	[ "I8",					  8,  1,  0,  0,  0,  0, false,  true ],		// IMAGE_FORMAT_I8,
	[ "IA88",				 16,  2,  0,  0,  0,  8, false,  true ],		// IMAGE_FORMAT_IA88
	[ "P8",					  8,  1,  0,  0,  0,  0, false, false ],		// IMAGE_FORMAT_P8
	[ "A8",					  8,  1,  0,  0,  0,  8, false,  true ],		// IMAGE_FORMAT_A8
	[ "RGB888 Bluescreen",	 24,  3,  8,  8,  8,  0, false,  true ],		// IMAGE_FORMAT_RGB888_BLUESCREEN
	[ "BGR888 Bluescreen",	 24,  3,  8,  8,  8,  0, false,  true ],		// IMAGE_FORMAT_BGR888_BLUESCREEN
	[ "ARGB8888",			 32,  4,  8,  8,  8,  8, false,  true ],		// IMAGE_FORMAT_ARGB8888
	[ "BGRA8888",			 32,  4,  8,  8,  8,  8, false,  true ],		// IMAGE_FORMAT_BGRA8888
	[ "DXT1",				  4,  0,  5,  6,  5,  0,  true,  true ],		// IMAGE_FORMAT_DXT1
	[ "DXT3",				  8,  0,  0,  0,  0,  8,  true,  true ],		// IMAGE_FORMAT_DXT3
	[ "DXT5",				  8,  0,  0,  0,  0,  8,  true,  true ],		// IMAGE_FORMAT_DXT5
	[ "BGRX8888",			 32,  4,  8,  8,  8,  0, false,  true ],		// IMAGE_FORMAT_BGRX8888
	[ "BGR565",				 16,  2,  5,  6,  5,  0, false,  true ],		// IMAGE_FORMAT_BGR565
	[ "BGRX5551",			 16,  2,  5,  5,  5,  0, false,  true ],		// IMAGE_FORMAT_BGRX5551
	[ "BGRA4444",			 16,  2,  4,  4,  4,  4, false,  true ],		// IMAGE_FORMAT_BGRA4444
	[ "DXT1 One Bit Alpha",	  4,  0,  0,  0,  0,  1,  true,  true ],		// IMAGE_FORMAT_DXT1_ONEBITALPHA
	[ "BGRA5551",			 16,  2,  5,  5,  5,  1, false,  true ],		// IMAGE_FORMAT_BGRA5551
	[ "UV88",				 16,  2,  8,  8,  0,  0, false,  true ],		// IMAGE_FORMAT_UV88
	[ "UVWQ8888",			 32,  4,  8,  8,  8,  8, false,  true ],		// IMAGE_FORMAT_UVWQ8899
	[ "RGBA16161616F",	     64,  8, 16, 16, 16, 16, false,  true ],		// IMAGE_FORMAT_RGBA16161616F
	[ "RGBA16161616",	     64,  8, 16, 16, 16, 16, false,  true ],		// IMAGE_FORMAT_RGBA16161616
	[ "UVLX8888",			 32,  4,  8,  8,  8,  8, false,  true ],		// IMAGE_FORMAT_UVLX8888
	[ "R32F",				 32,  4, 32,  0,  0,  0, false,  true ],		// IMAGE_FORMAT_R32F
	[ "RGB323232F",			 96, 12, 32, 32, 32,  0, false,  true ],		// IMAGE_FORMAT_RGB323232F
	[ "RGBA32323232F",		128, 16, 32, 32, 32, 32, false,  true ],		// IMAGE_FORMAT_RGBA32323232F
	[ "nVidia DST16",		 16,  2,  0,  0,  0,  0, false,  true ],		// IMAGE_FORMAT_NV_DST16
	[ "nVidia DST24",		 24,  3,  0,  0,  0,  0, false,  true ],		// IMAGE_FORMAT_NV_DST24
	[ "nVidia INTZ",		 32,  4,  0,  0,  0,  0, false,  true ],		// IMAGE_FORMAT_NV_INTZ
	[ "nVidia RAWZ",		 32,  4,  0,  0,  0,  0, false,  true ],		// IMAGE_FORMAT_NV_RAWZ
	[ "ATI DST16",			 16,  2,  0,  0,  0,  0, false,  true ],		// IMAGE_FORMAT_ATI_DST16
	[ "ATI DST24",			 24,  3,  0,  0,  0,  0, false,  true ],		// IMAGE_FORMAT_ATI_DST24
	[ "nVidia NULL",		 32,  4,  0,  0,  0,  0, false,  true ],		// IMAGE_FORMAT_NV_NULL
	[ "ATI1N",				  4,  0,  0,  0,  0,  0,  true,  true ],		// IMAGE_FORMAT_ATI1N
	[ "ATI2N",				  8,  0,  0,  0,  0,  0,  true,  true ],		// IMAGE_FORMAT_ATI2N
];

function _ComputeImageSize(uiWidth, uiHeight, uiDepth, ImageFormat) {
	switch(ImageFormat)
	{
	case exports.VTFImageFormatType.IMAGE_FORMAT_DXT1:
	case exports.VTFImageFormatType.IMAGE_FORMAT_DXT1_ONEBITALPHA:
		if(uiWidth < 4 && uiWidth > 0)
			uiWidth = 4;

		if(uiHeight < 4 && uiHeight > 0)
			uiHeight = 4;

		return Math.floor((uiWidth + 3) / 4) * Math.floor((uiHeight + 3) / 4) * 8 * uiDepth;
	case exports.VTFImageFormatType.IMAGE_FORMAT_DXT3:
	case exports.VTFImageFormatType.IMAGE_FORMAT_DXT5:
		if(uiWidth < 4 && uiWidth > 0)
			uiWidth = 4;

		if(uiHeight < 4 && uiHeight > 0)
			uiHeight = 4;

		return Math.floor((uiWidth + 3) / 4) * Math.floor((uiHeight + 3) / 4) * 16 * uiDepth;
	default:
		return uiWidth * uiHeight * uiDepth * VTFImageFormatInfo[ImageFormat][2];
	}
}

function ComputeImageSize(uiWidth, uiHeight, uiDepth, uiMipmaps, ImageFormat) {
	let uiImageSize = 0;

	for (let i = 0; i < uiMipmaps; i++) {
		uiImageSize += _ComputeImageSize(uiWidth, uiHeight, uiDepth, ImageFormat);
		
		uiWidth >>= 1;
		uiHeight >>= 1;
		uiDepth >>= 1;

		if(uiWidth < 1)
			uiWidth = 1;

		if(uiHeight < 1)
			uiHeight = 1;

		if(uiDepth < 1)
			uiDepth = 1;
	}

	return uiImageSize;
}

class BinaryEditor {
	constructor(data) {
		this.size = 0;
		this.data = data;
	}

	read(size) {
		return this.data.slice(this.size, this.size += size);
	}

	addSize(size) {
		this.size += size;
		return this.size - size;
	}

	read32() {
		return this.data.readInt32LE(this.addSize(4));
	}

	readu32() {
		return this.data.readUInt32LE(this.addSize(4));
	}

	readu16() {
		return this.data.readUInt16LE(this.addSize(2));
	}

	readu8() {
		return this.data.readUInt8(this.addSize(1));
	}

	readf32() {
		return this.data.readFloatLE(this.addSize(4));
	}

	write(data) {
		data = data.toString();
		this.data.write(data, this.addSize(data.length), data.length);
		return this;
	}

	write32(v) {
		this.data.writeInt32LE(v, this.addSize(4));
		return this;
	}

	writeu32(v) {
		this.data.writeUInt32LE(v, this.addSize(4));
		return this;
	}

	writeu16(v) {
		this.data.writeUInt16LE(v, this.addSize(2));
		return this;
	}

	writeu8(v) {
		this.data.writeUInt8(v, this.addSize(1));
		return this;
	}

	writef32(v) {
		this.data.writeFloatLE(v, this.addSize(4));
		return this;
	}

	binarySize() {
		return this.size;
	}
}

exports.VTFImageData = class VTFImageData {
	constructor(width, height, depth, format, data) {
		this.Width = width;
		this.Height = height;
		this.Depth = depth;

		this.Data = data;
		this.Format = format;
	}

	toRGBA8888() {
		if (this.Depth !== 1)
			throw new Error("Depth != 1 pls test this");

		switch (this.Format) {
			case exports.VTFImageFormatType.IMAGE_FORMAT_DXT5:
				return Buffer.from(dxt.decompress(this.Data, this.Width, this.Height, dxt.flags.DXT5));
			case exports.VTFImageFormatType.IMAGE_FORMAT_DXT3:
				return Buffer.from(dxt.decompress(this.Data, this.Width, this.Height, dxt.flags.DXT3));
			
			case exports.VTFImageFormatType.IMAGE_FORMAT_ABGR8888:
				let data = Buffer.from(this.Data);
				for (let i = 0; i < data.length; i += 4) {
					let a = data[i];
					let b = data[i + 1];

					data[i] = data[i + 3];
					data[i + 1] = data[i + 2];
					data[i + 2] = b;
					data[i + 3] = a;
				}

				return data;

			default:
				throw new Error("Unsupported format: " + exports.VTFImageFormatTypeList[this.Format]);
		}
	}

	static convert(rgba8888, width, height, format) {
		switch (format) {
			case exports.VTFImageFormatType.IMAGE_FORMAT_DXT5:
				return Buffer.from(dxt.compress(rgba8888, width, height, dxt.flags.DXT5));
			case exports.VTFImageFormatType.IMAGE_FORMAT_DXT3:
				return Buffer.from(dxt.compress(rgba8888, width, height, dxt.flags.DXT3));
			case exports.VTFImageFormatType.IMAGE_FORMAT_DXT1:
				return Buffer.from(dxt.compress(rgba8888, width, height, dxt.flags.DXT1));
			
			case exports.VTFImageFormatType.IMAGE_FORMAT_ABGR8888:
				let data = Buffer.from(rgba8888);
				for (let i = 0; i < data.length; i += 4) {
					let a = data[i];
					let b = data[i + 1];

					data[i] = data[i + 3];
					data[i + 1] = data[i + 2];
					data[i + 2] = b;
					data[i + 3] = a;
				}

				return data;

			default:
				throw new Error("Unsupported format: " + exports.VTFImageFormatTypeList[format]);
		}
	}

	fromRGBA8888(rgba8888) {
		this.Data = exports.VTFImageData.convert(rgba8888, this.Width, this.Height, this.Format);
		return this;
	}

	convert(format) {
		return new exports.VTFImageData(this.Width, this.Height, this.Depth, format).fromRGBA8888(this.toRGBA8888());
	}
}

exports.VTFFile = class VTFFile extends BinaryEditor {
	constructor(data, offset) {
		super(data, offset);
		if (data) {
			this.FileHeader = this.read(4);
			this.VersionMajor = this.read32();
			this.VersionMinor = this.read32();
			this.HeaderSize = this.read32();		

			if (this.VersionMajor < 7) {
				throw new Error("Unsupported Major version: " + this.VersionMajor);
			}

			this.Width = this.readu16();
			this.Height = this.readu16();
			this.Flags = this.readu32();
			this.Frames = this.readu16();
			this.StartFrame = this.readu16();
			this.Padding0 = Buffer.alloc(4); this.read(4);
			this.Reflectivity = [
				this.readf32(),
				this.readf32(),
				this.readf32()
			];
			this.Padding1 = Buffer.alloc(4); this.read(4);
			this.BumpScale = this.readf32();
			this.ImageFormat = this.readu32();
			this.MipCount = this.readu8();
			this.LowResImageFormat = this.readu32();
			this.LowResImageWidth = this.readu8();
			this.LowResImageHeight = this.readu8();

			if (this.VersionMajor > 7 || this.VersionMinor >= 2) {
				this.Depth = this.readu16();
			}
			else {
				this.Depth = 1;
				this.size += 2;
			}

			this.Resources = [];

			let imageOffset, thumbnailOffset;

			if (this.VersionMajor > 7 || this.VersionMinor >= 3) {
				this.Padding2 = Buffer.alloc(3); this.read(3); // 3??
				this.ResourceCount = this.readu32();

				this.size = 80;

				let tmp_resources = [];
				for (let i = 0; i < this.ResourceCount; i++) {
					let obj = {};
					obj.Type = this.readu32();
					obj.Data = this.readu32();
					tmp_resources.push(obj);
				}

				for (let resource of tmp_resources) {
					if (resource.Type == exports.VTFResourceTypes.IMAGE) {
						imageOffset = resource.Data;
					}
					else if (resource.Type == exports.VTFResourceTypes.LOW_RES_IMAGE) {
						thumbnailOffset = resource.Data;
					}
					else if ((resource.Type & 0x02000000) == 0) {
						let last_size = this.size;
						this.size = obj.Data;
						this.Resources.push(new exports.VTFResource(resource.Type, this.read(this.readu32())));
						this.size = last_size;
					}
				}
			}
			else {
				this.Padding2 = Buffer.alloc(3);
				this.ResourceCount = 0;

				this.size = 80;
			}

			let last_size = this.size;

			if (this.LowResImageFormat !== exports.VTFImageFormatType.IMAGE_FORMAT_NONE) {
				if (thumbnailOffset)
					this.size = thumbnailOffset;
				this.Resources.push(new exports.VTFResource(exports.VTFResourceTypes.LOW_RES_IMAGE, this.read(ComputeImageSize(this.LowResImageWidth, this.LowResImageHeight, 1, 1, this.LowResImageFormat))));
			}

			if (this.ImageFormat !== exports.VTFImageFormatType.IMAGE_FORMAT_NONE) {
				if (imageOffset)
					this.size = imageOffset;
				this.Resources.push(new exports.VTFResource(exports.VTFResourceTypes.IMAGE, this.read(ComputeImageSize(this.Width, this.Height, this.Depth, this.MipCount, this.ImageFormat))));
			}

			this.size = last_size;
		}
		else {
			this.FileHeader = Buffer.from("VTF\0");
			
			this.Width = 0;
			this.Height = 0;
			this.Flags = 0;
			this.Frames = 0;
			this.StartFrame = 0;
			this.Padding0 = Buffer.alloc(4);

			this.Reflectivity = [0, 0, 0];

			this.Padding1 = Buffer.alloc(4);
			this.BumpScale = 0;
			this.ImageFormat = -1;

			this.MipCount = 1;
			
			this.LowResImageFormat = 0;
			this.LowResImageWidth = 0;
			this.LowResImageHeight = 0;
			this.Depth = 1;
			this.Padding2 = Buffer.alloc(4);
			this.ResourceCount = 0;
		}
	}

	getImageResource() {
		return this.Resources.find(x => x.Type == exports.VTFResourceTypes.IMAGE);
	}

	getImages() {
		let imgs = [];

		let img = this.getImageResource();

		let cur = img.Data.length;
		let uiWidth = this.Width;
		let uiHeight = this.Height;
		let uiDepth = this.Depth;

		for (let i = 0; i < this.MipCount; i++) {
			let end = cur;
			cur -= _ComputeImageSize(uiWidth, uiHeight, uiDepth, this.ImageFormat);

			imgs.unshift(new exports.VTFImageData(uiWidth, uiHeight, uiDepth, this.ImageFormat, img.Data.slice(cur, end)));

			uiWidth >>= 1;
			uiHeight >>= 1;
			uiDepth >>= 1;

			if(uiWidth < 1)
				uiWidth = 1;

			if(uiHeight < 1)
				uiHeight = 1;

			if(uiDepth < 1)
				uiDepth = 1;
		}

		return imgs;
	}

	setImage(newimage) {
		let img = this.getImageResource();

		img.Data = newimage.Data;
		this.ImageFormat = newimage.Format;
		this.Width = newimage.Width;
		this.Height = newimage.Height;
		this.Depth = newimage.Depth;
		this.MipCount = 1;
	}

	toBuffer() {
		this.data = Buffer.alloc(80);
		this.size = 0;

		this.write(this.FileHeader);
		this.write32(7);
		this.write32(5);
		this.write32(this.data.length + 8 * this.Resources.length);
		this.writeu16(this.Width);
		this.writeu16(this.Height);
		this.writeu32(this.Flags);
		this.writeu16(this.Frames);
		this.writeu16(this.StartFrame);
		this.write(this.Padding0);
		for (let i = 0; i < 3; i++)
			this.writef32(this.Reflectivity[i]);

		this.write(this.Padding1);
		this.writef32(this.BumpScale);
		this.writeu32(this.ImageFormat);
		this.writeu8(this.MipCount);
		this.writeu32(this.LowResImageFormat);
		this.writeu8(this.LowResImageWidth);
		this.writeu8(this.LowResImageHeight);
		this.writeu16(this.Depth);
		this.write(this.Padding2);
		this.writeu32(this.Resources.length);

		let arr = [this.data];
		let cur = this.data.length + 8 * this.Resources.length;
		for (let resource of this.Resources) {
			resource.Offset = cur;
			cur += resource.Data.length;
			arr.push(resource.toBuffer());
		}


		for (let resource of this.Resources) {
			if (resource.Type == exports.VTFResourceTypes.IMAGE || resource.Type == exports.VTFResourceTypes.LOW_RES_IMAGE) {
				arr.push(resource.Data);
			}
			else if ((resource.Type & 0x02000000) == 0) {
				let buf = Buffer.alloc(4);
				buf.writeUInt32LE(resource.Data.length, 0);
				arr.push(buf);
				arr.push(resource.Data);
			}
		}

		return Buffer.concat(arr);
	}
};

exports.VTFResource = class VTFResource {
	constructor(type, data) {
		this.Type = type;
		this.Data = data;
	}

	toBuffer() {
		let buf = Buffer.alloc(8);
		buf.writeUInt32LE(this.Type, 0);
		buf.writeUInt32LE(this.Offset, 4);

		return buf;
	}
};