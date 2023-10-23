export type Block = {
	state: boolean
	color: string
	transparency: number
	height: number
	base: number
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
	address: {
		x: number
		y: number
	}
	block: Block
	blockDistance: number
	column: number
	intAngle: number
	angle: number
	distance: number
	isEdge: boolean
}

export type Ray = {
	x: number
	y: number
}

export type BlockAddress = {
	x: number
	y: number
}

export type BlocksToRender = {
	[key: string]: {
		address: BlockAddress
		distance: number
		switches: {
			su: 0 | 1
			sd: 0 | 1
			ssd: -1 | 1
			sl: 0 | 1
			sr: 0 | 1
			ssl: -1 | 1
		}
	}
}
