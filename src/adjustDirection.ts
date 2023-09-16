import { rotationSpeed } from "."
import { limitAngle } from "./limitAngle"
import { KeyPresses, Position } from "./types"

export const adjustDirection = (
	keyPresses: KeyPresses,
	position: Position,
	ff: number
) => {
	if (keyPresses.left) {
		position.angle = limitAngle(position.angle - rotationSpeed * ff)
	}
	if (keyPresses.right) {
		position.angle = limitAngle(position.angle + rotationSpeed * ff)
	}
}
