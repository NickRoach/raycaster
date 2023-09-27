import { maxHeight } from "./constants"
import { Block } from "./types"

const makeColor = () => {
	const getColor = () =>
		Math.round(Math.random() * 255)
			.toString(16)
			.padStart(2, "0")
	return `#${getColor()}${getColor()}${getColor()}`
}

export const makeBlockArray = (xSize: number, ySize: number) => {
	let array: [Block[]] = [[]]
	for (let x = 0; x < xSize; x++) {
		array[x] = []
		for (let y = 0; y < ySize; y++) {
			array[x][y] = {
				state: Math.random() > 0.9,
				// state: false,
				color: makeColor(),
				transparency: Math.random() * 0.5 + 0.5,
				// transparency: 1,
				height: Math.random() * 3 + 1,
				// height: 1,
				base: Math.max(Math.random() * maxHeight - 4, 1)
				// base: 0
			}
		}
	}
	return array
}
