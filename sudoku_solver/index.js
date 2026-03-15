
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
	const resetButton = document.getElementById('reset');
	
	const grid = new Grid(GRID_SIZE, DEBUG);
	grid.generate(container);
	grid.load(extremeCode);

	solveAllButton.onclick = (e) => {
		while (solveStep(grid));
	}
	
	solveOneButton.onclick = (e) => {
		solveStep(grid);
	}
	
	resetButton.onclick = (e) => {
		grid.load(extremeCode);
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
				
				if (isNakedSingle(cell)) {
					solvedCell = cell;
					break;
				}
				
				if (isLastInBox(cell)) {
					solvedCell = cell;
					break;
				}
				
				if (isLastInRow(cell)) {
					solvedCell = cell;
					break;
				}
				
				if (isLastInColumn(cell)) {
					solvedCell = cell;
					break;
				}
			}
		}
	}
	
	if (solvedCell) {
		if (DEBUG) console.log(`Found a value at ${solvedCell.row}, ${solvedCell.col}`);
	}
	else {
		if (DEBUG) console.log(`Failed to find a value in ${ATTEMPT_LIMIT} attempts`);
	}
	
	return solvedCell !== null
}

function isNakedSingle(cell) {
	if (cell.possible.length != 1) {
		return false;
	}
	
	cell.parentGrid.setValue(cell.row, cell.col, cell.possible[0]);
	
	return true;
}

function isLastInBox(cell) {
	let cellPossible = cell.possible;
	
	const boxRow = Math.floor(cell.row / 3) * 3;
	const boxCol = Math.floor(cell.col / 3) * 3;
	
	for (let row = boxRow; row < boxRow + 3; row++) {
		for (let col = boxCol; col < boxCol + 3; col++) {
			if (row === cell.row && col === cell.col) continue;
			
			const boxCell = cell.parentGrid.cells[row][col];
			
			if (boxCell.solved) continue;
			
			cellPossible = cellPossible.filter(n => !boxCell.possible.includes(n));
		}
	}
	
	if (cellPossible.length != 1) {
		return false;
	}
	
	cell.parentGrid.setValue(cell.row, cell.col, cellPossible[0]);
	
	return true;
}

function isLastInColumn(cell) {
	let cellPossible = cell.possible;
	
	for (let col = 0; col < GRID_SIZE; col++) {
		if (col === cell.col) continue;
		
		const boxCell = cell.parentGrid.cells[cell.row][col];
		
		if (boxCell.solved) continue;
		
		cellPossible = cellPossible.filter(n => !boxCell.possible.includes(n));
	}
	
	if (cellPossible.length != 1) {
		return false;
	}
	
	cell.parentGrid.setValue(cell.row, cell.col, cellPossible[0]);
	
	return true;
}

function isLastInRow(cell) {
	let cellPossible = cell.possible;
	
	for (let row = 0; row < GRID_SIZE; row++) {
		if (row === cell.row) continue;
		
		const boxCell = cell.parentGrid.cells[row][cell.col];
		
		if (boxCell.solved) continue;
		
		cellPossible = cellPossible.filter(n => !boxCell.possible.includes(n));
	}
	
	if (cellPossible.length != 1) {
		return false;
	}
	
	cell.parentGrid.setValue(cell.row, cell.col, cellPossible[0]);
	
	return true;
}