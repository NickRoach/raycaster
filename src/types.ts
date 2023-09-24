export type Block = {
	state: boolean
	color: string
	transparency?: number
	height?: number
}

export type Position = {
	x: number
	y: number
	angle: number
	height: number
}

export type KeyPresses = {
	up: boolean
	down: boolean
	left: boolean
	right: boolean
	shift: boolean
	ctrl: boolean
}
