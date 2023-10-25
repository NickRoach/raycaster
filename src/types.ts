export type Block = {
	state: boolean
	color: string
	transparency: number
	height: number
	base: number
	movingUp: boolean
	minBase: number
	maxBase: number
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

export type BlockAddress = {
	x: number
	y: number
}

export type BlocksToRender = {
	[key: string]: {
		block: Block
		address: BlockAddress
		distance: number
	}
}

export type Faces = {
	[key: string]: Vertex[]
}

export type Vertex = {
	x: number
	y: number
	distanceCor: number
}

export type FaceWithDistance = {
	[key: string]: Vertex[] | number
	averageDistance: number
}
