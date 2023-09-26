import { Block } from "./types"

export const fillOuterWallBlocks = (blockArray: [Block[]]) => {
	const getStateProbability = () => {
		// return Math.random() > 0.2
		return true
	}

	const getColor = () => {
		return Math.random() > 0.5 ? "#38475C" : "#354459"
	}

	const wallBlockHeight = 1.2

	//sides
	for (let x = 0; x < blockArray.length; x += blockArray.length - 1) {
		for (let y = 0; y < blockArray[0].length; y++) {
			blockArray[x][y].state = getStateProbability()
			blockArray[x][y].color = getColor()
			blockArray[x][y].height = wallBlockHeight
			blockArray[x][y].base = 0
			blockArray[x][y].transparency = 1
		}
	}
	// top and bottom
	for (let y = 0; y < blockArray[0].length; y += blockArray[0].length - 1) {
		for (let x = 1; x < blockArray.length - 1; x++) {
			blockArray[x][y].state = getStateProbability()
			blockArray[x][y].color = getColor()
			blockArray[x][y].height = wallBlockHeight
			blockArray[x][y].base = 0
			blockArray[x][y].transparency = 1
		}
	}
}
