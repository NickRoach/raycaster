export type Block = {
	state: boolean
	color: string
	transparency?: string
	height?: number
}

export type Position = {
	x: number
	y: number
	angle: number
}

export type KeyPresses = {
	up: boolean
	down: boolean
	left: boolean
	right: boolean
	shift: boolean
	ctrl: boolean
}
