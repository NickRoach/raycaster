import { topViewBlockColor } from "./constants"
import { Block } from "./types"

export const makeBlockArray = (xSize: number, ySize: number) => {
	let array: [Block[]] = [[]]
	for (let x = 0; x < xSize; x++) {
		array[x] = []
		for (let y = 0; y < ySize; y++) {
			array[x][y] = {
				// state: false,
				state: Math.random() > 0.97,
				color: topViewBlockColor
			}
		}
	}
	return array
}
