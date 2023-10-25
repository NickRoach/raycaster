import { Block } from "./types"

export const moveBlocks = (blockArray: [Block[]]) => {
	for (let x = 1; x < blockArray.length - 1; x++) {
		for (let y = 1; y < blockArray[x].length - 1; y++) {
			const block = blockArray[x][y]
			const distanceFromEnd = () =>
				Math.min(block.base - block.minBase, block.maxBase - block.base)

			const movementSpeed =
				Math.sqrt(Math.max(distanceFromEnd(), 0.0001)) * 0.03

			if (block.state) {
				if (block.base >= block.maxBase || block.base <= block.minBase)
					block.movingUp = !block.movingUp
				if (block.movingUp) {
					block.base += movementSpeed
				} else {
					block.base -= movementSpeed
				}
			}
		}
	}
}
