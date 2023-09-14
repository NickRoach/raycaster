export const resizeCanvas = (canvas: HTMLCanvasElement) => {
	canvas.height = window.innerHeight - 4
	canvas.width = window.innerWidth
}
