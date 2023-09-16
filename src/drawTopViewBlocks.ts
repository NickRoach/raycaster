import { topViewLeft, topViewBlockSize, topViewTop } from "./constants"
import { Block } from "./types"

export const drawTopViewBlocks = (
	ctx: CanvasRenderingContext2D,
	blockArray: [Block[]]
) => {
	for (let x = 0; x < blockArray.length; x++) {
		for (let y = 0; y < blockArray[0].length; y++) {
			if (blockArray[x][y].state) {
				ctx.fillStyle = blockArray[x][y].color
				ctx.fillRect(
					topViewLeft + x * topViewBlockSize,
					topViewTop + y * topViewBlockSize,
					topViewBlockSize,
					topViewBlockSize
				)
				ctx.closePath()
			}
		}
	}
}
