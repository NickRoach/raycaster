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
				state: Math.random() > 0.98,
				color: makeColor(),
				// transparency: Math.random() * 0.5 + 0.5,
				transparency: 1,
				// height: Math.random() * 10 + 1,
				height: 2,
				// base: Math.random() > 0.7 ? Math.random() * 5 : 0
				base: 0
			}
		}
	}
	return array
}
