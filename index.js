const dxt = require("dxt-js");

const VTFResourceTypes = exports.VTFResourceTypes = {
	LOW_RES_IMAGE: 1,
	IMAGE: 48, 
};

const VTFResource = exports.VTFResource = class VTFResource {
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

let VTFImageFormatInfo = exports.RawImageFormats = [];

for (let [index, value] of [
	[ "RGBA8888",			 32,  4,  8,  8,  8,  8, false,  true ],
	[ "ABGR8888",			 32,  4,  8,  8,  8,  8, false,  true ],
	[ "RGB888",				 24,  3,  8,  8,  8,  0, false,  true ],
	[ "BGR888",				 24,  3,  8,  8,  8,  0, false,  true ],
	[ "RGB565",				 16,  2,  5,  6,  5,  0, false,  true ],
	[ "I8",					  8,  1,  0,  0,  0,  0, false,  true ],
	[ "IA88",				 16,  2,  0,  0,  0,  8, false,  true ],
	[ "P8",					  8,  1,  0,  0,  0,  0, false, false ],
	[ "A8",					  8,  1,  0,  0,  0,  8, false,  true ],
	[ "RGB888 Bluescreen",	 24,  3,  8,  8,  8,  0, false,  true ],
	[ "BGR888 Bluescreen",	 24,  3,  8,  8,  8,  0, false,  true ],
	[ "ARGB8888",			 32,  4,  8,  8,  8,  8, false,  true ],
	[ "BGRA8888",			 32,  4,  8,  8,  8,  8, false,  true ],
	[ "DXT1",				  4,  0,  5,  6,  5,  0,  true,  true ],
	[ "DXT3",				  8,  0,  0,  0,  0,  8,  true,  true ],
	[ "DXT5",				  8,  0,  0,  0,  0,  8,  true,  true ],
	[ "BGRX8888",			 32,  4,  8,  8,  8,  0, false,  true ],
	[ "BGR565",				 16,  2,  5,  6,  5,  0, false,  true ],
	[ "BGRX5551",			 16,  2,  5,  5,  5,  0, false,  true ],
	[ "BGRA4444",			 16,  2,  4,  4,  4,  4, false,  true ],
	[ "DXT1 One Bit Alpha",	  4,  0,  0,  0,  0,  1,  true,  true ],
	[ "BGRA5551",			 16,  2,  5,  5,  5,  1, false,  true ],
	[ "UV88",				 16,  2,  8,  8,  0,  0, false,  true ],
	[ "UVWQ8888",			 32,  4,  8,  8,  8,  8, false,  true ],
	[ "RGBA16161616F",	     64,  8, 16, 16, 16, 16, false,  true ],
	[ "RGBA16161616",	     64,  8, 16, 16, 16, 16, false,  true ],
	[ "UVLX8888",			 32,  4,  8,  8,  8,  8, false,  true ],
	[ "R32F",				 32,  4, 32,  0,  0,  0, false,  true ],
	[ "RGB323232F",			 96, 12, 32, 32, 32,  0, false,  true ],
	[ "RGBA32323232F",		128, 16, 32, 32, 32, 32, false,  true ],
	[ "nVidia DST16",		 16,  2,  0,  0,  0,  0, false,  true ],
	[ "nVidia DST24",		 24,  3,  0,  0,  0,  0, false,  true ],
	[ "nVidia INTZ",		 32,  4,  0,  0,  0,  0, false,  true ],
	[ "nVidia RAWZ",		 32,  4,  0,  0,  0,  0, false,  true ],
	[ "ATI DST16",			 16,  2,  0,  0,  0,  0, false,  true ],
	[ "ATI DST24",			 24,  3,  0,  0,  0,  0, false,  true ],
	[ "nVidia NULL",		 32,  4,  0,  0,  0,  0, false,  true ],
	[ "ATI1N",				  4,  0,  0,  0,  0,  0,  true,  true ],
	[ "ATI2N",				  8,  0,  0,  0,  0,  0,  true,  true ],
].entries()) {
	VTFImageFormatInfo.push({
		Name: value[0],
		BitsPerPixel: value[1],
		Channels: value[2],
		ChannelBits: {
			r: value[3],
			g: value[4],
			b: value[5],
			a: value[6]
		},
		ID: index,
	});
}

VTFImageFormatInfo.push({
	Name: "none",
	BitsPerPixel: 0,
	Channels: 0,
	ChannelBits: {
		r: 0,
		g: 0,
		b: 0,
		a: 0
	},
	ID: 0xffffffff,
})

const GetImageTypeData = exports.GetImageTypeData = function GetImageTypeData(x) {
	if (typeof x === "string") {
		x = x.toLowerCase();
		return VTFImageFormatInfo.find(a => a.Name.toLowerCase() === x);
	}
	return VTFImageFormatInfo.find(a => a.ID == x);
}

const GetImageType = exports.GetImageType = function GetImageType(x) {
	let d = GetImageTypeData(x)
	return d ? d.Name : "none";
}

function _ComputeImageSize(uiWidth, uiHeight, uiDepth, ImageFormat) {
	switch(ImageFormat)
	{
	case "DXT1":
	case "DXT1_ONEBITALPHA":
		if(uiWidth < 4 && uiWidth > 0)
			uiWidth = 4;

		if(uiHeight < 4 && uiHeight > 0)
			uiHeight = 4;

		return Math.floor((uiWidth + 3) / 4) * Math.floor((uiHeight + 3) / 4) * 8 * uiDepth;
	case "DXT3":
	case "DXT5":
		if(uiWidth < 4 && uiWidth > 0)
			uiWidth = 4;

		if(uiHeight < 4 && uiHeight > 0)
			uiHeight = 4;

		return Math.floor((uiWidth + 3) / 4) * Math.floor((uiHeight + 3) / 4) * 16 * uiDepth;
	default:
		return Math.ceil((uiWidth * uiHeight * uiDepth * GetImageTypeData(ImageFormat).BitsPerPixel) / 8);
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

const VTFImageData = exports.VTFImageData = class VTFImageData {
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

		let data;
		let from = this.Data;
		switch (this.Format) {
			case "DXT5":
				return Buffer.from(dxt.decompress(from, this.Width, this.Height, dxt.flags.DXT5));
			case "DXT3":
				return Buffer.from(dxt.decompress(from, this.Width, this.Height, dxt.flags.DXT3));
			case "DXT1":
				return Buffer.from(dxt.decompress(from, this.Width, this.Height, dxt.flags.DXT1));
			
			case "ABGR8888":
				data = Buffer.from(from);
				for (let i = 0; i < data.length; i += 4) {
					let a = data[i];
					let b = data[i + 1];

					data[i] = data[i + 3];
					data[i + 1] = data[i + 2];
					data[i + 2] = b;
					data[i + 3] = a;
				}

				return data;

			case "BGRA8888":
				data = Buffer.from(from);
				for (let i = 0; i < data.length; i += 4) {
					let b = data[i];
					data[i] = data[i + 2];
					data[i + 2] = b;
				}
				return data;

			case "RGBA8888":
				return Buffer.from(from);

			case "RGB888":
				data = Buffer.alloc(from.length / 3 * 4);
				for (let i = 0; i < from.length; i += 3) {
					let base = i / 3 * 4;
					for (let x = 0; x < 3; x++)
						data[base + x] = from[i + x]
					data[base + 3] = 255;
				}
				return data;
			default:
				throw new Error("Unsupported format: " + this.Format);
		}
	}

	static convert(from, width, height, format) {
		let data;
		switch (format) {
			case "DXT5":
				return Buffer.from(dxt.compress(from, width, height, dxt.flags.DXT5));
			case "DXT3":
				return Buffer.from(dxt.compress(from, width, height, dxt.flags.DXT3));
			case "DXT1":
				return Buffer.from(dxt.compress(from, width, height, dxt.flags.DXT1));
			
			case "ABGR8888":
				data = Buffer.from(from);
				for (let i = 0; i < data.length; i += 4) {
					let a = data[i];
					let b = data[i + 1];

					data[i] = data[i + 3];
					data[i + 1] = data[i + 2];
					data[i + 2] = b;
					data[i + 3] = a;
				}

				return data;

			case "ABGR8888":
				data = Buffer.from(from);
				for (let i = 0; i < data.length; i += 4) {
					let a = data[i];
					let b = data[i + 1];

					data[i] = data[i + 3];
					data[i + 1] = data[i + 2];
					data[i + 2] = b;
					data[i + 3] = a;
				}

				return data;

			case "BGRA8888":
				data = Buffer.from(from);
				for (let i = 0; i < data.length; i += 4) {
					let b = data[i];
					data[i] = data[i + 2];
					data[i + 2] = b;
				}
				return data;

			case "RGB888":
				data = Buffer.alloc(from.length / 4 * 3);
				for (let i = 0; i < from.length; i += 4) {
					let base = i / 4 * 3;
					for (let x = 0; x < 3; x++)
						data[base + x] = from[i + x]
				}
				return data;

			case "RGBA8888":
				return Buffer.from(from);

			default:
				throw new Error("Unsupported format: " + format);
		}
	}

	fromRGBA8888(rgba8888) {
		this.Data = VTFImageData.convert(rgba8888, this.Width, this.Height, this.Format);
		return this;
	}

	convert(format) {
		return new VTFImageData(this.Width, this.Height, this.Depth, format).fromRGBA8888(this.toRGBA8888());
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
			this.ImageFormat = GetImageType(this.readu32());
			this.MipCount = this.readu8();
			this.LowResImageFormat = GetImageType(this.readu32());
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
					if (resource.Type == VTFResourceTypes.IMAGE) {
						imageOffset = resource.Data;
					}
					else if (resource.Type == VTFResourceTypes.LOW_RES_IMAGE) {
						thumbnailOffset = resource.Data;
					}
					else if ((resource.Type & 0x02000000) == 0) {
						let last_size = this.size;
						this.size = obj.Data;
						this.Resources.push(new VTFResource(resource.Type, this.read(this.readu32())));
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

			if (this.LowResImageFormat !== "none") {
				if (thumbnailOffset)
					this.size = thumbnailOffset;
				this.Resources.push(new VTFResource(VTFResourceTypes.LOW_RES_IMAGE, this.read(ComputeImageSize(this.LowResImageWidth, this.LowResImageHeight, 1, 1, this.LowResImageFormat))));
			}

			if (this.ImageFormat !== "none") {
				if (imageOffset)
					this.size = imageOffset;
				this.Resources.push(new VTFResource(VTFResourceTypes.IMAGE, this.read(ComputeImageSize(this.Width, this.Height, this.Depth, this.MipCount, this.ImageFormat))));
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
		return this.Resources.find(x => x.Type == VTFResourceTypes.IMAGE);
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

			imgs.unshift(new VTFImageData(uiWidth, uiHeight, uiDepth, this.ImageFormat, img.Data.slice(cur, end)));

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
		this.writeu32(GetImageTypeData(this.ImageFormat).ID);
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
			if (resource.Type == VTFResourceTypes.IMAGE || resource.Type == VTFResourceTypes.LOW_RES_IMAGE) {
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
