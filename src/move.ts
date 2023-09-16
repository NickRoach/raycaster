import {
	fastFactor,
	movementSpeed,
	positionXMax,
	positionYMax,
	strafeSpeed,
	topViewHeight,
	topViewWidth,
	xSize,
	ySize
} from "./constants"
import { adjustDirection } from "./adjustDirection"
import { getBlockAddress } from "./getBlockAddress"
import { getRadians } from "./getRadians"
import { limitAngle } from "./limitAngle"
import { Block, KeyPresses, Position } from "./types"

const limitPosition = (
	position: Position,
	newPosition: Position,
	blockArray: [Block[]]
) => {
	// limit to the arena space
	if (position.x > positionXMax) newPosition.x = positionXMax
	if (position.x < 0) newPosition.x = 0
	if (position.y > positionYMax) newPosition.y = positionYMax
	if (position.y < 0) newPosition.y = 0

	// limit which blocks it can go into
	const currentBlockAddress = getBlockAddress(position)
	const newBlockAddress = getBlockAddress(newPosition)

	if (newBlockAddress.x > blockArray.length - 1) {
		newPosition.x = position.x
		newBlockAddress.x = currentBlockAddress.x
	} else if (newBlockAddress.x < 0) {
		newPosition.x = position.x
		newBlockAddress.x = currentBlockAddress.x
	}
	if (newBlockAddress.y > blockArray[0].length - 1) {
		newPosition.y = position.y
		newBlockAddress.y = currentBlockAddress.y
	} else if (newBlockAddress.y < 0) {
		newPosition.y = position.y
		newBlockAddress.y = currentBlockAddress.y
	}

	const newBlock: boolean =
		newBlockAddress.x != currentBlockAddress.x ||
		newBlockAddress.y != currentBlockAddress.y

	// if not moving into a new block
	if (!newBlock) return newPosition

	// if we're trying to move diagonally between blocks directly across a corner
	const diagonal =
		newBlockAddress.x != currentBlockAddress.x &&
		newBlockAddress.y != currentBlockAddress.y

	// if moving into new block but not diagonally: if that block is clear, go ahead
	if (!blockArray[newBlockAddress.x][newBlockAddress.y].state && !diagonal) {
		return newPosition
	} else {
		// if it isn't clear or is a diagonal
		const xDirection = newPosition.x > position.x
		const yDirection = newPosition.y > position.y

		const doMoveY = () => {
			// if we're not crossing a y boundary
			if (newBlockAddress.y === currentBlockAddress.y) {
				return true
			}
			// if we're moving up and the block above is clear
			if (
				yDirection === false &&
				!blockArray[currentBlockAddress.x][currentBlockAddress.y - 1]
					.state
			) {
				return true
			}

			// if we're moving down and the block below is clear
			if (
				yDirection &&
				!blockArray[currentBlockAddress.x][currentBlockAddress.y + 1]
					.state
			)
				return true
			return false
		}

		const doMoveX = () => {
			// if we're not crossing an x boundary
			if (newBlockAddress.x === currentBlockAddress.x) return true

			// if we're moving right and the block to the right is clear
			if (
				xDirection &&
				!blockArray[currentBlockAddress.x + 1][currentBlockAddress.y]
					.state
			) {
				return true
			}
			// if we're moving left and the block left is clear
			if (
				xDirection === false &&
				!blockArray[currentBlockAddress.x - 1][currentBlockAddress.y]
					.state
			) {
				return true
			}
			return false
		}

		if (!doMoveY()) newPosition.y = position.y
		if (!doMoveX()) newPosition.x = position.x

		return newPosition
	}
}

export const move = (
	position: Position,
	keyPresses: KeyPresses,
	blockArray: [Block[]]
) => {
	let newPosition = {
		...position,
		x: position.x,
		y: position.y
	}

	const xUnits = Math.sin(getRadians(-position.angle))
	const yUnits = Math.cos(getRadians(-position.angle))
	const ff = keyPresses.shift ? fastFactor : 1

	if (!keyPresses.ctrl) {
		adjustDirection(keyPresses, position, ff)
	} else {
		if (keyPresses.left) {
			const strafeXUnits = Math.sin(getRadians(-position.angle - 90))
			const strafeYUnits = Math.cos(getRadians(-position.angle - 90))
			newPosition.x += strafeXUnits * strafeSpeed * ff
			newPosition.y += strafeYUnits * strafeSpeed * ff
		} else if (keyPresses.right) {
			const strafeXUnits = Math.sin(getRadians(-position.angle + 90))
			const strafeYUnits = Math.cos(getRadians(-position.angle + 90))
			newPosition.x += strafeXUnits * strafeSpeed * ff
			newPosition.y += strafeYUnits * strafeSpeed * ff
		}
	}

	if (keyPresses.up) {
		newPosition.x -= xUnits * movementSpeed * ff
		newPosition.y -= yUnits * movementSpeed * ff
	} else if (keyPresses.down) {
		newPosition.x += xUnits * movementSpeed * ff
		newPosition.y += yUnits * movementSpeed * ff
	}
	const limitedPosition = limitPosition(position, newPosition, blockArray)
	position.x = limitedPosition.x
	position.y = limitedPosition.y
}
