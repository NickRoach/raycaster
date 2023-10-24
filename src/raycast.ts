import { fieldOfViewAngle, raycastWidth, topViewBlockSize } from "./constants"
import { drawDot } from "./drawDot"
import { drawFloorAndSky } from "./drawFloorAndSky"
import { getBlockAddressXY } from "./getBlockAddress"
import { getDistance } from "./getDistance"
import { getDegrees, getRadians } from "./getRadians"
import { isOOR } from "./isOOR"
import { limitAngle } from "./limitAngle"
import { Block, BlocksToRender, Position } from "./types"

export const raycast = (
	position: Position,
	blockArray: [Block[]],
	ctx: CanvasRenderingContext2D
) => {
	drawFloorAndSky(ctx)

	// keep a list of the blocks already found
	let blocksToRender: BlocksToRender = {}

	// number of columns in a half
	const n = raycastWidth / 2
	// angle of half the field of view
	const theta = fieldOfViewAngle / 2
	// we know that for the first and last column, the y distance is:
	const yFactor = n / Math.tan(getRadians(theta))

	// for every angle/column, we need the distance to the closest intersect with a solid block
	for (let column = 0; column < raycastWidth; column++) {
		// column offset from the center of the field of view
		const columnOffset = column - raycastWidth / 2
		// now we can use that y factor for other columns
		const angleOffset = getDegrees(Math.atan(columnOffset / yFactor))

		const angle = limitAngle(position.angle + angleOffset)

		// sd is 1 if facing down. switch down
		const sd = angle > 90 && angle < 270 ? 1 : 0
		const su = sd === 0 ? 1 : 0
		// ssd is -1 when facing down. switch sign down
		const ssd = sd === 1 ? -1 : 1

		// sv is for "switch left". It is 1 when looking left
		const sl = angle < 360 && angle > 180 ? 1 : 0
		const sr = sl === 0 ? 1 : 0
		// ssl is for "sign flip left". It is -1 when looking left
		const ssl = sl === 1 ? -1 : 1

		// find horizontal intersects
		let searchEnd: boolean = false

		// y value of the first horizontal intercept
		const y1h =
			sd * topViewBlockSize + ssd * (position.y % topViewBlockSize)

		let i = 0
		while (!searchEnd) {
			const y = y1h + topViewBlockSize * i
			const x = y * Math.tan(getRadians(sd * 360 + ssd * angle))
			const intX = position.x + x
			const intY = position.y - ssd * y
			if (isOOR(intX, intY)) {
				searchEnd = true
			}
			if (!searchEnd) {
				const address = getBlockAddressXY(
					intX,
					intY + topViewBlockSize / 2
				)
				const key = `${address.x},${address.y}`
				const block = blockArray[address.x][address.y]
				if (!blocksToRender[key] && block.state) {
					blocksToRender[key] = {
						block,
						address,
						distance: getDistance(intX, intY, position)
					}
				}
			}
			i++
		}

		// find vertical intersects

		// x value of the first vertical intercept
		const x1v =
			sr * topViewBlockSize - ssl * (position.x % topViewBlockSize)

		searchEnd = false
		let j = 0
		while (!searchEnd) {
			// horizontal distance to next x intercept
			const x = x1v + topViewBlockSize * j
			// vertical distance to that intercept
			const y = x / Math.tan(getRadians(angle))

			const intX = position.x + x * ssl
			const intY = position.y - y * ssl

			if (isOOR(intX, intY)) {
				searchEnd = true
			}
			if (!searchEnd) {
				const address = getBlockAddressXY(
					intX + topViewBlockSize / 2,
					intY
				)
				const block = blockArray[address.x][address.y]
				const key = `${address.x},${address.y}`
				if (!blocksToRender[key] && block.state) {
					blocksToRender[key] = {
						block,
						address,
						distance: getDistance(intX, intY, position)
					}
				}
				j++
			}
		}
	}
	return { blocksToRender, yFactor }
}
