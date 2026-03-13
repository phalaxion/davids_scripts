globalThis.addEventListener('DOMContentLoaded', (e) => {
	const GRID_SIZE = 9;

	const startingCode = "9,,,5,,8,,,7|,8,,3,,2,9,,5|,5,4,,,,,8,|,7,,6,8,,,3,2|1,,,,,4,,,8|5,,,2,1,9,,6,|,,,9,,6,,,1|7,2,6,,,1,,4,|,,1,4,7,,,5,6"
	const startingValues = startingCode.split('|').map(row => row.split(','));

	const stepHistory = [];
	let grid = generateGrid(GRID_SIZE);

	loadGrid(grid, startingValues);

	// const solveAllButton = document.getElementById('solve-all');
	const solveOneButton = document.getElementById('solve-one');
	const undoOneButton = document.getElementById('undo-one');

	solveOneButton.onclick = (e) => {
		const step = solveStep(grid);
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

			const result = checkLineOfSight(rowIndex, colIndex, grid);

			if (result) {
				return { rowIndex, colIndex, result };
			}
		}
	}

	return grid;
}

function checkLineOfSight(cellRow, cellCol, grid) {
	return 1;
}

