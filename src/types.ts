export type Block = {
	state: boolean
	color: string
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
