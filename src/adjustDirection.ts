import { rotationSpeed } from "."
import { limitAngle } from "./limitAngle"
import { KeyPresses, Position } from "./types"

export const adjustDirection = (keyPresses: KeyPresses, position: Position) => {
	if (keyPresses.left) {
		position.angle = limitAngle(position.angle + rotationSpeed)
	}
	if (keyPresses.right) {
		position.angle = limitAngle(position.angle - rotationSpeed)
	}
}
