import {
	movementSpeed,
	positionXMax,
	positionYMax,
	strafeSpeed,
	topViewHeight,
	topViewWidth,
	xSize,
	ySize
} from "."
import { adjustDirection } from "./adjustDirection"
import { getRadians } from "./getRadians"
import { limitAngle } from "./limitAngle"
import { Block, KeyPresses, Position } from "./types"

const getBlockAddress = (position: Position) => {
	return {
		x: Math.floor((position.x / topViewWidth) * xSize),
		y: Math.floor((position.y / topViewHeight) * ySize)
	}
}

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

	// don't allow passage into state: true blocks
	const currentBlockAddress = getBlockAddress(position)
	const newBlockAddress = getBlockAddress(newPosition)

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

	const strafeAngle = position.angle + 90

	const xUnits = Math.sin(getRadians(position.angle))
	const yUnits = Math.cos(getRadians(position.angle))

	if (!keyPresses.shift) {
		adjustDirection(keyPresses, position)
	} else {
		if (keyPresses.left) {
			const strafeXUnits = Math.sin(getRadians(position.angle - 90))
			const strafeYUnits = Math.cos(getRadians(position.angle - 90))
			newPosition.x += strafeXUnits * strafeSpeed
			newPosition.y += strafeYUnits * strafeSpeed
		} else if (keyPresses.right) {
			const strafeXUnits = Math.sin(getRadians(position.angle + 90))
			const strafeYUnits = Math.cos(getRadians(position.angle + 90))
			newPosition.x += strafeXUnits * strafeSpeed
			newPosition.y += strafeYUnits * strafeSpeed
		}
	}

	if (keyPresses.up) {
		newPosition.x -= xUnits * movementSpeed
		newPosition.y -= yUnits * movementSpeed
	} else if (keyPresses.down) {
		newPosition.x += xUnits * movementSpeed
		newPosition.y += yUnits * movementSpeed
	}
	const limitedPosition = limitPosition(position, newPosition, blockArray)
	position.x = limitedPosition.x
	position.y = limitedPosition.y
}
