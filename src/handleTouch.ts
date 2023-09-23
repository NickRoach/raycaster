import { raycastHeight, raycastLeft, raycastTop } from "./constants"

export const handleTouchMove = (e, keyPresses, touches) => {
	const { lastTouch } = touches
	const touch = e.touches[0]
	const isInRaycastRender =
		touch.clientX > raycastLeft &&
		touch.clientY > raycastTop &&
		touch.clientX < raycastLeft + raycastHeight &&
		touch.clientY < raycastTop + raycastHeight
	if (lastTouch && isInRaycastRender) {
		if (touch.clientX > lastTouch.clientX + 3) {
			keyPresses.right = true
			keyPresses.left = false
		} else if (touch.clientX < lastTouch.clientX - 3) {
			keyPresses.left = true
			keyPresses.right = false
		} else {
			keyPresses.left = false
			keyPresses.right = false
		}
		if (touch.clientY > lastTouch.clientY + 3) {
			keyPresses.down = true
			keyPresses.up = false
		} else if (touch.clientY < lastTouch.clientY - 3) {
			keyPresses.up = true
			keyPresses.down = false
		} else {
			keyPresses.up = false
			keyPresses.down = false
		}
	}
	touches.lastTouch = touch
}

export const handleTouchEnd = (e, keyPresses, touches) => {
	keyPresses.up = false
	keyPresses.down = false
	keyPresses.left = false
	keyPresses.right = false
	touches.lastTouch = null
}
