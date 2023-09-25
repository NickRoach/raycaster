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
	w: boolean
	s: boolean
}

export type Vertical = {
	x: number
	y: number
	block: Block
	column: number
	angle: number
	distance: number
	isEdge: boolean
}
