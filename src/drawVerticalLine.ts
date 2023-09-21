import { RgbaData } from "./types"

export const drawVerticalLine = (
	rgba: RgbaData,
	column: number,
	bottom: number,
	top: number,
	color: any[]
) => {
	for (let y = bottom; y < top; y++) {
		rgba.data[column][y] = color
	}
}
