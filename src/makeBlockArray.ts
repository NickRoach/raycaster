import { maxHeight } from "./constants"
import { Block } from "./types"

const makeColor = () => {
	return `#${(Math.random() * 99).toFixed(0).padStart(2, "0")}${(
		Math.random() * 99
	)
		.toFixed(0)
		.padStart(2, "0")}${(Math.random() * 99).toFixed(0).padStart(2, "0")}`
}

// this is the old color generator
// const makeColor = () => {
// 	return `#7${(Math.random() * 9).toFixed(0).padStart(1, "0")}6${(
// 		Math.random() * 9
// 	)
// 		.toFixed(0)
// 		.padStart(1, "0")}5${(Math.random() * 9).toFixed(0).padStart(1, "0")}`
// }

export const makeBlockArray = (xSize: number, ySize: number) => {
	let array: [Block[]] = [[]]
	for (let x = 0; x < xSize; x++) {
		array[x] = []
		for (let y = 0; y < ySize; y++) {
			array[x][y] = {
				state: Math.random() > 0.9,
				// state: false,
				color: makeColor(),
				// transparency: Math.random(),
				transparency: 1,
				// height: Math.random() * 10 + 1,
				height: 1,
				base: Math.random() * maxHeight - 1
				// base: 0
			}
		}
	}
	return array
}
