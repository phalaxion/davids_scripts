
// SET CSS CLASSES TO HAVE A LITTLE VISIBLE NUMBER when updating possible values

import { Grid } from './sudoku.js'

const DEBUG = true;
const GRID_SIZE = 9;
const ATTEMPT_LIMIT = 50;

const easyCode = "060308100581009600003500000090802000000745936350006804135000000708613400940007300";
const mediumCode = "203400005809160704006030019702003060008250000001607002007005926930720000600090470";
const hardCode = "100034008070680030008210704054090680910508020080300005305906871006000040001070200";
const expertCode = "150082000300070010000000753000527609000000500040063807400008000703040100008600300";
const masterCode = "000600489640000050020040000000005803180000924070020100008090040000007208003000001";
const extremeCode = "007003001005120040200006000000002000004000900500780006800510007070000060000300000";

globalThis.addEventListener('DOMContentLoaded', (e) => {
	const container = document.getElementById('sudoku-container');
	const solveAllButton = document.getElementById('solve-all');
	const solveOneButton = document.getElementById('solve-one');
	const undoOneButton = document.getElementById('undo-one');
	const undoAllButton = document.getElementById('undo-all');
	
	const grid = new Grid(GRID_SIZE, DEBUG);
	grid.generate(container);
	grid.load(extremeCode);

	solveAllButton.onclick = (e) => {
		while (solveStep(grid));
	}
	
	solveOneButton.onclick = (e) => {
		solveStep(grid);
	}
	
	undoOneButton.onclick = (e) => {
		grid.undoStep();
	}

	undoAllButton.onclick = (e) => {
		while (grid.history.length > 0) {
			grid.undoStep();
		}
	}
});

function solveStep(grid) {
	if (!grid.leftToSolve) {
		if (DEBUG) console.log(`Grid is fully solved`);
		return false;
	}
	
	let solvedCell = null;
	
	for (let attempts = 0; attempts <= ATTEMPT_LIMIT; attempts++) {
		if (solvedCell) {
			break;
		}
		
		for (const row of grid.cells) {
			if (solvedCell) {
				break;
			}
			
			for (const cell of row) {
				if (cell.value) continue;
				
				if (isNakedSingle(grid, cell)) {
					solvedCell = cell;
					break;
				}
				
				if (isLastInBox(grid, cell)) {
					solvedCell = cell;
					break;
				}
				
				if (isLastInRow(grid, cell)) {
					solvedCell = cell;
					break;
				}
				
				if (isLastInColumn(grid, cell)) {
					solvedCell = cell;
					break;
				}
			}
		}
	}
	
	if (!solvedCell) {
		console.log(`Failed to find a value in ${ATTEMPT_LIMIT} attempts`);
	}
	
	return solvedCell !== null
}

function isNakedSingle(grid, cell) {
	if (cell.possible.length != 1) {
		return false;
	}
	
	grid.setValue(cell.row, cell.col, cell.possible[0], 'naked_single');
	
	return true;
}

function isLastInBox(grid, cell) {
	let cellPossible = cell.possible;
	
	const boxRow = Math.floor(cell.row / 3) * 3;
	const boxCol = Math.floor(cell.col / 3) * 3;
	
	for (let row = boxRow; row < boxRow + 3; row++) {
		for (let col = boxCol; col < boxCol + 3; col++) {
			if (row === cell.row && col === cell.col) continue;
			
			const boxCell = grid.cells[row][col];
			
			if (boxCell.solved) continue;
			
			cellPossible = cellPossible.filter(n => !boxCell.possible.includes(n));
		}
	}
	
	if (cellPossible.length != 1) {
		return false;
	}
	
	grid.setValue(cell.row, cell.col, cellPossible[0], 'last_in_box');
	
	return true;
}

function isLastInColumn(grid, cell) {
	let cellPossible = cell.possible;
	
	for (let col = 0; col < GRID_SIZE; col++) {
		if (col === cell.col) continue;
		
		const boxCell = grid.cells[cell.row][col];
		
		if (boxCell.solved) continue;
		
		cellPossible = cellPossible.filter(n => !boxCell.possible.includes(n));
	}
	
	if (cellPossible.length != 1) {
		return false;
	}
	
	grid.setValue(cell.row, cell.col, cellPossible[0], 'last_in_column');
	
	return true;
}

function isLastInRow(grid, cell) {
	let cellPossible = cell.possible;
	
	for (let row = 0; row < GRID_SIZE; row++) {
		if (row === cell.row) continue;
		
		const boxCell = grid.cells[row][cell.col];
		
		if (boxCell.solved) continue;
		
		cellPossible = cellPossible.filter(n => !boxCell.possible.includes(n));
	}
	
	if (cellPossible.length != 1) {
		return false;
	}
	
	grid.setValue(cell.row, cell.col, cellPossible[0], 'last_in_row');
	
	return true;
}