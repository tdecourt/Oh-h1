// ==================== Globals ====================
const Globals = {
	cellsMargin: 5,
	gameSize: 4
}

// ==================== Errors ====================
class UnknownStateError extends Error {
	constructor(message = null) {
		super(message);
	}
}
class BlockedCellError extends Error {
	constructor(message = null) {
		super(message);
	}
}
class InvalidSizeError extends Error {
	constructor(message = null) {
		super(message);
	}
}
class ArgumentError extends Error {
	constructor(message = null) {
		super(message);
	}
}

// ==================== States ====================
/**
 * Défini la notion abstraite de l'état d'une cellule
 */
class State {
	constructor() {
		if (this.constructor === State) {
			throw new TypeError('Abstract class "State" cannot be instantiated directly');
		}
	}
	get state() {
		throw new Error('You must implement this function');
	}

	get color() {
		throw new Error('You must implement this function');
	}

	handle() {
		throw new Error('You must implement this function');
	}
}
/**
 * Défini la notion de l'état vide d'une cellule
 */
class EmptyState extends State {
	constructor() {
		super();
	}

	/**
	 * Numéro de l'état de la cellule
	 * @return {number} Numéro d'état de la cellule
	 */
	get state() {
		return 0;
	}

	/**
	 * Couleur de la cellule
	 * @return {string} Couleur de la cellule
	 */
	get color() {
		return "#ADADAD";
	}

	/**
	 * Retourne le nouvel état de la cellule
	 * @return {State} Nouvel état de la cellule
	 */
	handle() {
		return new FisrtState();
	}
}
/**
 * Défini la notion du premier état d'une cellule
*/
class FisrtState extends State {
	constructor() {
		super();
	}

	/**
	 * Numéro de l'état de la cellule
	 * @return {number} Numéro d'état de la cellule
	 */
	get state() {
		return 1;
	}

	/**
	 * Couleur de la cellule
	 * @return {string} Couleur de la cellule
	 */
	get color() {
		return "#8D1E20";
	}

	/**
	 * Retourne le nouvel état de la cellule
	 * @return {State} Nouvel état de la cellule
	 */
	handle() {
		return new SecondState();
	}
}
/**
 * Défini la notion du second état d'une cellule
 */
class SecondState extends State {
	constructor() {
		super();
	}

	/**
	 * Numéro de l'état de la cellule
	 * @return {number} Numéro d'état de la cellule
	 */
	get state() {
		return 2;
	}

	/**
	 * Couleur de la cellule
	 * @return {string} Couleur de la cellule
	 */
	get color() {
		return "#34639D";
	}

	/**
	 * Retourne le nouvel état de la cellule
	 * @return {State} Nouvel état de la cellule
	 */
	handle() {
		return new EmptyState();
	}
}

// ==================== Cell ====================
/**
 * Défini la notion de cellule
 */
class Cell {
	/**
	 * Créé une nouvelle cellule
	 * @param {number} x emplacement de la cellule (axe X)
	 * @param {number} y emplacement de la cellule (axe Y)
	 * @param {number} size taille de la cellule
	 * @param {number | undefined} state état de la cellule (si elle est bloquée)
	 * @throws {UnknownStateError} Argument state ne peut-être que 0, 1, 2 ou undefined
	 */
	constructor(x, y, size, state = undefined) {
		if (size === undefined || x === undefined || y === undefined)
			throw new ArgumentError('Cell(x number, y number, size number, state? number | undefined)')
		this._x = x;
		this._y = y;
		this._size = size;
		switch (state) {
			case null:
			case undefined:
			case 0:
				this._state = new EmptyState();
				this._isBlocked = false;
				// this._isBlocked = false; // DEBUG
				break;
			case 1:
				this._state = new FisrtState();
				this._isBlocked = true;
				// this._isBlocked = false; // DEBUG
				break;
			case 2:
				this._state = new SecondState();
				this._isBlocked = true;
				// this._isBlocked = false; // DEBUG
				break;

			default:
				throw UnknownStateError();
		}
	}

	/**
	 * Vérifie si la position donnée se trouve dans la cellule
	 * @param {number} x position X
	 * @param {number} y position Y
	 * @return {boolean} Si la position est dans la cellule
	 */
	isIn(x, y) {
		return (
			x > this._x &&
			x < this._x + this._size &&
			y > this._y &&
			y < this._y + this._size
		);
	}

	/**
	 * Numéro d'état de la cellule
	 * @return {number} Numéro d'état de la cellule
	 */
	get state() {
		return this._state.state;
	}

	/**
	 * Change l'état de la cellule et renvoi sa nouvelle couleur
	 * @throws {BlockedCellError} La cellule est bloquée
	 */
	toggleState() {
		if (this._isBlocked) throw new BlockedCellError("Cette cellule ne peut pas être modifiée");
		this._state = this._state.handle();
	}

	/**
	 * Dessine la cellule dans le contexte
	 * @param {CanvasRenderingContext2D} ctx Contexte de rendu
	 */
	draw(ctx) {
		ctx.fillStyle = this._state.color;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.roundRect(this._x, this._y, this._size, this._size, 10);
		ctx.fill();
		if (this._isBlocked)
			ctx.stroke();
	}


	/**
	 * Vérouille la cellule dans son état actuel
	 */
	block() {
		this._isBlocked = true;
	}
}

// ==================== Game ====================
/**
 * Défini la notion de partie
 */
class Game {
	/**
	 * Créé une nouvelle partie
	 * @param {number} size Défini la taille de la grille
	 * @param {CanvasRenderingContext2D} ctx Contexte de rendu
	 * @throws {InvalidSizeError} L'attribut size ne peut être que pair et suppérieur à 4
	 */
	constructor(size, ctx, empty = false) {
		this._ctx = ctx;
		let cellSize = (ctx.canvas.width / size) - 2 * Globals.cellsMargin;
		if (size % 2 !== 0 || size < 4) throw new InvalidSizeError("Taille de grille invalide");
		this._grid = [];
		for (let x = 0; x < size; x++) {
			this._grid[x] = [];
			for (let y = 0; y < size; y++) {
				const cellPos = {
					x: x * cellSize + 2 * x * Globals.cellsMargin + Globals.cellsMargin,
					y: y * cellSize + 2 * y * Globals.cellsMargin + Globals.cellsMargin
				}
				if (!empty) this._grid[x][y] = new Cell(cellPos.x, cellPos.y, cellSize, this._getRandomInt(3));
				else this._grid[x][y] = new Cell(cellPos.x, cellPos.y, cellSize, 0);
			}
		}
		this.draw();
	}

	/**
	 * Vérifie la validitée de la grille
	 * @return {boolean} Validité de la grille
	 */
	verify() {
		// Vérification de chaques lignes
		for (let x = 0; x < this._grid.length; x++) {
			let nbFirst = 0;
			let nbSecond = 0;
			let curState = 0;
			let nbSame = 0;
			for (let y = 0; y < this._grid[x].length; y++) {
				const cell = this._grid[y][x];
				if (cell.state === 0) { console.log('empty cell'); return false; }
				else if (cell.state === 1) nbFirst++;
				else if (cell.state === 2) nbSecond++;
				else throw new Error('UnkownState : ' + cell.state);
				// Vérification si 3 cote à cote
				if (curState === cell.state) nbSame++;
				else { nbSame = 0; curState = cell.state }
				if (nbSame > 2) { console.log('3 cote à cote'); return false; }
			}
			if (nbFirst != nbSecond) { console.log('pas le même nombre', nbFirst, nbSecond); return false; }
		}
		// Vérification de chaques colones
		for (let x = 0; x < this._grid.length; x++) {
			let nbFirst = 0;
			let nbSecond = 0;
			let curState = 0;
			let nbSame = 0;
			for (let y = 0; y < this._grid[x].length; y++) {
				const cell = this._grid[x][y];
				if (cell.state === 0) { console.log('empty cell'); return false; }
				else if (cell.state === 1) nbFirst++;
				else if (cell.state === 2) nbSecond++;
				else throw new Error('UnkownState : ' + cell.state);
				// Vérification si 3 cote à cote
				if (curState === cell.state) nbSame++;
				else { nbSame = 0; curState = cell.state }
				if (nbSame > 2) { console.log('3 cote à cote'); return false; }
			}
			if (nbFirst != nbSecond) { console.log('pas le même nombre', nbFirst, nbSecond); return false; }
		}
		// Vérification lignes identiques
		for (let y = 0; y < this._grid.length; y++) {
			for (let y2 = y + 1; y2 < this._grid.length; y2++) {
				let nbSame = 0;
				for (let x = 0; x < this._grid.length; x++)
					if (this._grid[y][x].state === this._grid[y2][x].state) nbSame++;
				if (nbSame === this._grid.length) { console.log('Same lines : ' + y + ', ' + y2); return false; }
			}
		}
		// Vérification colonnes identiques
		for (let x = 0; x < this._grid.length; x++) {
			for (let x2 = x + 1; x2 < this._grid.length; x2++) {
				let nbSame = 0;
				for (let y = 0; y < this._grid.length; y++)
					if (this._grid[x][y].state === this._grid[x2][y].state) nbSame++;
				if (nbSame === this._grid.length) { console.log('Same lines : ' + x + ', ' + x2); return false; }
			}
		}
		return true;
	}

	/**
	 * Renvoi un nombre aléatoire entre 0 et max
	 * @param {number} max Nombre maximum (exclus)
	 * @return {number} Nombre généré
	 */
	_getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}

	/**
	 * Renvoi l'index de la cellule à la position donnée (sinon null)
	 * @param {number} x position X
	 * @param {number} y position Y
	 * @returns index de la cellule
	 */
	_getCellIndex(x, y) {
		for (let i = 0; i < this._grid.length; i++) {
			const line = this._grid[i];
			for (let j = 0; j < line.length; j++) {
				const cell = line[j];
				if (cell.isIn(x, y)) return { x: i, y: j };
			}
		}
		return null;
	}

	/**
	 * Joue à l'endroit du click
	 * @param {number} x X click position
	 * @param {number} y Y click position
	 */
	play(x, y) {
		const cellIndex = this._getCellIndex(x, y);
		const cell = this._grid[cellIndex.x][cellIndex.y];
		cell.toggleState();
		this.draw();
	}

	/**
	 * Dessine la cellule dans la console
	 */
	drawConsole() {
		// console.log(this._grid);
		let str = '';
		for (let x = 0; x < this._grid.length; x++) {
			const line = this._grid[x];
			str += '[';
			for (let y = 0; y < line.length; y++) {
				const cell = line[y];
				if (y !== 0) str += ', ';
				str += cell.state;
			}
			str += ']\n';
		}
		console.log(str);
	}

	/**
	 * Dessine la cellule dans le contexte
	 */
	draw() {
		// this.drawConsole();
		this._ctx.clearRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
		for (let x = 0; x < this._grid.length; x++) {
			const line = this._grid[x];
			for (let y = 0; y < line.length; y++) {
				const cell = line[y];
				cell.draw(this._ctx)
			}
		}
	}
}

// ==================== Main ====================
/**
 * Renvoi la position d'un évenement par rapport à son contexte
 * @param {CanvasRenderingContext2D} canvas Contexte de rendu
 * @param {Event} evt Evenement du click
 * @returns position de l'évenement par rapport au contexte
 */
function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

window.addEventListener('load', evt => {
	const canvas = document.getElementById('drawingArea');
	const ctx = canvas.getContext('2d');

	let game = new Game(Globals.gameSize, ctx);

	document.getElementById('solve').addEventListener('click', evt => {
		throw new Error('Sovle function is not implemented yet');
	})

	document.getElementById('verify').addEventListener('click', evt => {
		canvas.classList.remove('border-dark', 'border-success', 'border-danger', 'border-5');
		if (game.verify()) canvas.classList.add('border-success', 'border-5');
		else canvas.classList.add('border-danger', 'border-5');
	})

	document.getElementById('empty').addEventListener('click', evt => {
		game = new Game(Globals.gameSize, ctx, true);
	})

	canvas.addEventListener('click', evt => {
		const mousePos = getMousePos(canvas, evt);
		game.play(mousePos.x, mousePos.y);
	})

	document.getElementById('size4').addEventListener('click', evt => {
		Globals.gameSize = 4;
		game = new Game(Globals.gameSize, ctx);
	})

	document.getElementById('size6').addEventListener('click', evt => {
		Globals.gameSize = 6;
		game = new Game(Globals.gameSize, ctx);
	})

	document.getElementById('size8').addEventListener('click', evt => {
		Globals.gameSize = 8;
		game = new Game(Globals.gameSize, ctx);
	})

	document.getElementById('size12').addEventListener('click', evt => {
		Globals.gameSize = 12;
		game = new Game(Globals.gameSize, ctx);
	})
});