import { RgbaData } from "./types"

export const to2dRgbaArray = (imageData: ImageData) => {
	const array = []
	for (let x = 0; x < imageData.width; x++) {
		array[x] = []
		for (let y = 0; y < imageData.height; y++) {
			array[x][y] = []
			for (let i = 0; i < 4; i++) {
				array[x][y][i] =
					imageData.data[(x + y * imageData.width) * 4 + i]
			}
		}
	}
	return {
		data: array,
		colorSpace: imageData.colorSpace
	}
}

export const toImageData = (rgba: RgbaData, ctx: CanvasRenderingContext2D) => {
	const dataArray = rgba.data

	const newImageData = ctx.createImageData(
		rgba.data.length,
		rgba.data[0].length
	)

	for (let x = 0; x < dataArray.length; x++) {
		for (let y = 0; y < dataArray[0].length; y++) {
			for (let i = 0; i < 4; i++) {
				newImageData.data[(x + dataArray.length * y) * 4 + i] =
					dataArray[x][y][i]
			}
		}
	}
	return newImageData
}
