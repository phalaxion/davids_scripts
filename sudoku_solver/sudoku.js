export class Grid {
	
	debug = false;
	cells = [];
	
	constructor(gridSize, debug = false) {
		this.gridSize = gridSize;
		this.debug = debug;
		
		this.leftToSolve = gridSize * gridSize;
	}
	
	generate(htmlGrid) {
		for (let row = 0; row < this.gridSize; row++) {
			const inputRow = [];
			
			for (let col = 0; col < this.gridSize; col++) {
				const cell = new Cell(this, row, col, this.debug);
				
				htmlGrid.appendChild(cell.html);
				
				inputRow.push(cell);
			}

			this.cells.push(inputRow);
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
				
				this.cells[row][col].html.readOnly = true;
				this.cells[row][col].html.classList.add('starting-cell');
				this.setValue(row, col, startingValues[row][col])
			}
		}
	}
	
	setValue(row, col, value, reason = null) {
		this.cells[row][col].value = value;
		this.cells[row][col].html.value = value;
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
	
	debug = false;
	solved = false;
	value = "";
	possible = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
	
	constructor(grid, row, col, debug = false) {
		this.parentGrid = grid;
		this.row = row;
		this.col = col;
		this.debug = debug;
		
		let input = document.createElement('input');
		input.type = 'text';
		input.maxLength = 1;
		input.classList.add('sudoku-cell');
		
		if (row % 3 === 0) input.classList.add('bt');
		if (row % 3 === 2) input.classList.add('bb');
		if (col % 3 === 0) input.classList.add('bl');
		if (col % 3 === 2) input.classList.add('br');

		if (debug) {
			input.onclick = (e) => {
				console.log(this.row, this.col, this.possible);
			}
		}
		
		this.html = input;
	}
}