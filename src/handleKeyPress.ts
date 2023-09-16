import { KeyPresses } from "./types"

export const handleKeyDown = (e: KeyboardEvent, keyPresses: KeyPresses) => {
	switch (e.key) {
		case "ArrowUp":
			keyPresses.up = true
			keyPresses.down = false
			break
		case "ArrowDown":
			keyPresses.down = true
			keyPresses.up = false
			break
		case "ArrowLeft":
			keyPresses.left = true
			keyPresses.right = false
			break
		case "ArrowRight":
			keyPresses.right = true
			keyPresses.left = false
			break
		case "Shift":
			keyPresses.shift = true
			break
		case "Control":
			keyPresses.ctrl = true
			break
	}
}

export const handleKeyUp = (e: KeyboardEvent, keyPresses: KeyPresses) => {
	switch (e.key) {
		case "ArrowUp":
			keyPresses.up = false
			break
		case "ArrowDown":
			keyPresses.down = false
			break
		case "ArrowLeft":
			keyPresses.left = false
			break
		case "ArrowRight":
			keyPresses.right = false
			break
		case "Shift":
			keyPresses.shift = false
			break
		case "Control":
			keyPresses.ctrl = false
			break
	}
}
