import { Block } from "./types"

export const fillOuterWallBlocks = (blockArray: [Block[]]) => {
	for (let x = 0; x < blockArray.length; x += blockArray.length - 1) {
		for (let y = 0; y < blockArray[0].length; y++) {
			blockArray[x][y].state = true
		}
	}
	for (let y = 0; y < blockArray[0].length; y += blockArray[0].length - 1) {
		for (let x = 1; x < blockArray.length - 1; x++) {
			blockArray[x][y].state = true
		}
	}
}
