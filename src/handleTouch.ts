export const handleTouchMove = (e, keyPresses, touches) => {
	const { lastTouch } = touches
	const touch = e.touches[0]
	if (lastTouch) {
		if (touch.clientX > lastTouch.clientX) {
			keyPresses.right = true
			keyPresses.left = false
		} else if (touch.clientX < lastTouch.clientX) {
			keyPresses.left = true
			keyPresses.right = false
		} else {
			keyPresses.left = false
			keyPresses.right = false
		}
		if (touch.clientY > lastTouch.clientY) {
			keyPresses.down = true
			keyPresses.up = false
		} else if (touch.clientY < lastTouch.clientY) {
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
