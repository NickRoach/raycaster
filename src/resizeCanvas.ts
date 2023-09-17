import { margin, raycastLeft, raycastWidth } from "./constants"

export const resizeCanvas = (canvas: HTMLCanvasElement) => {
	canvas.height = window.innerHeight - 4
	canvas.width = window.innerWidth
	if (raycastWidth !== window.innerWidth - margin - raycastLeft) {
		window.location.reload()
	}
}
