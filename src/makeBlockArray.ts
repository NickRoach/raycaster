import { Block } from "./types"

export const makeBlockArray = (xSize: number, ySize: number) => {
	let array: [Block[]] = [[]]
	for (let x = 0; x < xSize; x++) {
		array[x] = []
		for (let y = 0; y < ySize; y++) {
			array[x][y] = {
				// state: false,
				state: Math.random() > 0.98,
				color: `#7${(Math.random() * 9).toFixed(0).padStart(1, "0")}6${(
					Math.random() * 9
				)
					.toFixed(0)
					.padStart(1, "0")}5${(Math.random() * 9)
					.toFixed(0)
					.padStart(1, "0")}`,
				transparency: 1,
				height: Math.max(Math.random() * 10, 1)
			}
		}
	}
	return array
}
