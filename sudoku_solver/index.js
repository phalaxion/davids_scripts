globalThis.addEventListener('DOMContentLoaded', (e) => {
	const GRID_SIZE = 9;

	const startingCode = "9,,,5,,8,,,7|,8,,3,,2,9,,5|,5,4,,,,,8,|,7,,6,8,,,3,2|1,,,,,4,,,8|5,,,2,1,9,,6,|,,,9,,6,,,1|7,2,6,,,1,,4,|,,1,4,7,,,5,6"
	const startingValues = startingCode.split('|').map(row => row.split(','));

	const stepHistory = [];
	let grid = generateGrid(GRID_SIZE);

	loadGrid(grid, startingValues);

	const solveAllButton = document.getElementById('solve-all');
	const solveOneButton = document.getElementById('solve-one');
	const undoOneButton = document.getElementById('undo-one');
	const undoAllButton = document.getElementById('undo-all');

	solveAllButton.onclick = (e) => {
		let step;
		while (step = solveStep(grid)) {
			stepHistory.push(step);
			grid[step.rowIndex][step.colIndex].value = step.result;
		}
	}
	
	solveOneButton.onclick = (e) => {
		const step = solveStep(grid);

		if (!step) {
			return;
		}

		stepHistory.push(step);
		grid[step.rowIndex][step.colIndex].value = step.result;
	}

	undoOneButton.onclick = (e) => {
		if (stepHistory.length === 0) {
			return;
		}

		const step = stepHistory.pop();
		grid[step.rowIndex][step.colIndex].value = "";
	}
	
	undoAllButton.onclick = (e) => {
		while (stepHistory.length > 0) {
			const step = stepHistory.pop();
			grid[step.rowIndex][step.colIndex].value = "";
		}
	}
});

function generateGrid(size) {
	const container = document.getElementById('sudoku-container');
	
	const inputGrid = [];
	for (let row = 0; row < size; row++) {
		const inputRow = [];
		const rowMod = row % 3;

		for (let col = 0; col < size; col++) {
			const colMod = col % 3
			
			let input = document.createElement('input');
			input.type = 'text';
			input.maxLength = 1;
			
			if (colMod === 0) {
				input.classList.add('bl');
			}

			if (colMod === 2) {
				input.classList.add('br');
			}

			if (rowMod === 0) {
				input.classList.add('bt');
			}

			if (rowMod === 2) {
				input.classList.add('bb');
			}

			input.classList.add('sudoku-cell');

			container.appendChild(input);
			inputRow.push(input);
		}

		inputGrid.push(inputRow);
	}

	return inputGrid;
}

function loadGrid(grid, startingValues) {
	for (const [rowIndex, row] of startingValues.entries()) {
		for (const [colIndex, cell] of row.entries()) {
			if (!cell) {
				continue;
			}

			grid[rowIndex][colIndex].value = cell
			grid[rowIndex][colIndex].readOnly = true;
			grid[rowIndex][colIndex].classList.add('starting-cell');
		}
	}
}

function solveStep(grid) {
	for (const [rowIndex, row] of grid.entries()) {
		for (const [colIndex, cell] of row.entries()) {
			// If it's already been solved, ignore it
			if (cell.value) {
				continue;
			}
			
			let result;

			if (result = lineOfSight(rowIndex, colIndex, grid)) {
				return { rowIndex, colIndex, result };
			}
			
			if (result = lastInBox(rowIndex, colIndex, grid)) {
				return { rowIndex, colIndex, result };
			}
		}
	}

	return null;
}

function lineOfSight(cellRow, cellCol, grid) {
	const candidates = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
	const seen = [];

	for (const [colIndex, cell] of grid[cellRow].entries()) {
		const value = cell.value;

		if (!value) {
			continue;
		}

		if (!seen.includes(value)) {
			seen.push(value);
		}
	}

	for (const [rowIndex, row] of grid.entries()) {
		const value = row[cellCol].value;

		if (!value) {
			continue;
		}

		if (!seen.includes(value)) {
			seen.push(value);
		}
	}

	const diff = candidates.filter(num => !seen.includes(num));

	if (diff.length != 1) {
		return null;
	}

	return diff[0];
}

function lastInBox(cellRow, cellCol, grid) {
	const candidates = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
	const seen = [];
	
	const rowOffset = Math.floor(cellRow / 3) * 3;
	const colOffset = Math.floor(cellCol / 3) * 3;
	
	for (let i = rowOffset; i < rowOffset + 3; i++) {
		for (let j = colOffset; j < colOffset + 3; j++) {
			const value = grid[i][j].value;

			if (!value) {
				continue;
			}
			
			seen.push(value);
		}
	}
	
	const diff = candidates.filter(num => !seen.includes(num));

	if (diff.length != 1) {
		return null;
	}

	return diff[0];
}
