import { topViewBlockColor, torchLightBlockColor } from "./constants"
import { Block } from "./types"

export const makeBlockArray = (xSize: number, ySize: number) => {
	let array: [Block[]] = [[]]
	for (let x = 0; x < xSize; x++) {
		array[x] = []
		for (let y = 0; y < ySize; y++) {
			array[x][y] = {
				// state: false,
				// state: (x === 12 || x === 25) && y % 2 === 0 ? true : false,
				// state: x === 23 && y > 50 ? true : false,
				state: Math.random() > 0.97,
				color: torchLightBlockColor
			}
		}
	}
	return array
}
