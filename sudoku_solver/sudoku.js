export class Grid {
	
	debug = false;
	grid = [];
	cells = [];

	history = [];
	
	constructor(gridSize, debug = false) {
		this.gridSize = gridSize;
		this.debug = debug;
		
		this.leftToSolve = gridSize * gridSize;
	}
	
	generate(htmlGrid) {
		for (let row = 0; row < this.gridSize; row++) {
			const cellRow = [];
			const elementRow = [];
			
			for (let col = 0; col < this.gridSize; col++) {
				const cell = new Cell(row, col);
				cellRow.push(cell);

				const element = cell.createElement();

				htmlGrid.appendChild(element);
				elementRow.push(element);
			}

			this.cells.push(cellRow);
			this.grid.push(elementRow);
		}
	}
	
	load(gridCode) {
		const startingValues = gridCode
			.match(/.{1,9}/g)
			.map(row => row
				.split("")
				.map(v => v === "0" ? "" : v)
			);
		
		for (let row = 0; row < this.gridSize; row++) {
			for (let col = 0; col < this.gridSize; col++) {
				if (!startingValues[row][col]) continue;
				
				this.grid[row][col].readOnly = true;
				this.grid[row][col].classList.add('starting-cell');
				this.setValue(row, col, startingValues[row][col], 'initialisation');
			}
		}
	}

	loadState(cells) {
		for (let i = 0; i < cells.length; i++) {
			for (let j = 0; j < cells[i].length; j++) {
				if (this.grid[i][j].value === cells[i][j].value) {
					continue;
				}

				this.grid[i][j].value = cells[i][j].value;
			}
		}
		
		this.cells = cells
	}
	
	setValue(row, col, value, reason = null) {
		if (reason !== "initialisation") {
			const lastState = structuredClone(this.cells);
			this.history.push(lastState);
		}

		const input = this.grid[row][col].querySelector('input');
		input.value = value;

		this.cells[row][col].value = value;
		this.cells[row][col].solved = true;
		
		this.leftToSolve--;
		
		this.setPossible(row, col, [value]);
		
		// Update the possibles for everything in the row to remove this value
		for (const cell of this.cells[row]) {
			if (cell.solved) continue;
			this.setPossible(cell.row, cell.col, cell.possible.filter(n => n != value));
		}
		
		// Update the possibles for everything in the columns to remove this value
		for (const row of this.cells) {
			if (row[col].solved) continue;
			this.setPossible(row[col].row, row[col].col, row[col].possible.filter(n => n != value));
		}
		
		// Update the possibles for everything in the box to remove this value
		const boxRow = Math.floor(row / 3) * 3;
		const boxCol = Math.floor(col / 3) * 3;
		
		for (let i	 = boxRow; i < boxRow + 3; i++) {
			for (let j = boxCol; j < boxCol + 3; j++) {
				if (this.cells[i][j].solved) continue;
				this.setPossible(i, j, this.cells[i][j].possible.filter(n => n != value));
			}
		}
	}
	
	setPossible(row, col, possible) {
		this.cells[row][col].possible = possible;
		
		if (!this.debug) {
			return;
		}

		for (let i = 1; i <= 9; i++) {
			const note = this.grid[row][col].querySelector(`.note-${i}`)

			if (!this.cells[row][col].solved & possible.includes(i.toString())) {
				note.style.visibility = 'visible';
			}
			else {
				note.style.visibility = 'hidden';
			}
		}
	}
	
	getLineOfSight(row, col) {
		const seen = new Set();

		for (const cell of this.cells[row]) {
			if (!cell.value) continue;

			seen.add(cell.value);
		}
		
		for (const row of this.cells) {
			if (!row[col].value) continue;

			seen.add(row[col].value);
		}

		return Array.from(seen); 
	}
	
	getBoxOfSight(row, col) {
		const seen = [];
	
		const boxRow = Math.floor(row / 3) * 3;
		const boxCol = Math.floor(col / 3) * 3;
		
		for (let i = boxRow; i < boxRow + 3; i++) {
			for (let j = boxCol; j < boxCol + 3; j++) {
				if (i === row && j === col) continue;
				
				if (!this.cells[i][j].value) continue;
				
				seen.push(this.cells[i][j].value);
			}
		}
		
		return seen;
	}
}

export class Cell {
	
	solved = false;
	value = "";
	possible = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
	
	constructor(row, col) {
		this.row = row;
		this.col = col;
	}

	createElement() {
		const wrapper = document.createElement('div');
		wrapper.classList.add('sudoku-cell');
		
		if (this.row % 3 === 0) wrapper.classList.add('bt');
		if (this.row % 3 === 2) wrapper.classList.add('bb');
		if (this.col % 3 === 0) wrapper.classList.add('bl');
		if (this.col % 3 === 2) wrapper.classList.add('br');

		let input = document.createElement('input');
		input.type = 'text';
		input.maxLength = 1;

		input.onclick = (e) => {
			console.log(this.row, this.col, this.possible);
		}

		wrapper.appendChild(input);

		for (let i = 1; i <= this.possible.length; i++) {
			const note = document.createElement('span');
			note.textContent = i;
			note.classList.add('note', `note-${i}`);

			wrapper.appendChild(note);
		}

		return wrapper;
	}
}