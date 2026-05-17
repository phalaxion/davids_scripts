const BOARD_SIZE = 15;
const SPEED = 100;
const grid = initialise(BOARD_SIZE);

let board = null;
let intervalId = null;
let currentDirection = 'east';
let head = null;
let tail = null;

window.onload = () => {
	board = document.getElementById('game-board');
	board.style.columns = BOARD_SIZE;
	
	grid[0][0].state = 'snake'
	grid[0][0].direction = currentDirection
	generateFood(grid);
	
	board.innerHTML = refreshGame(grid);
	
	head = grid[0][0];
	tail = grid[0][0];

	intervalId = setInterval(step, SPEED);
}

globalThis.onkeypress = (e) => {
	if (e.key === 'w' && currentDirection != 'south') {
		currentDirection = 'north'
	} 
	else if (e.key === 'd' && currentDirection != 'west') {
		currentDirection = 'east';
	}
	else if (e.key === 's' && currentDirection != 'north') {
		currentDirection = 'south';
	}
	else if (e.key === 'a' && currentDirection != 'east') {
		currentDirection = 'west';
	}
	
	clearTimeout(intervalId);
	intervalId = setInterval(step, SPEED);
}

function step() {
	let newHead = getNextCell(grid, head);
	
	if (newHead.state === 'snake') {
		clearTimeout(intervalId);
		alert('YOU LOST');
		return;
	}
	
	const ateFood = newHead.state === 'food';
	
	newHead.state = 'head';
	newHead.direction = currentDirection;
	grid[newHead.y][newHead.x] = newHead;
	
	head.state = 'snake'
	head = newHead;
	
	if (ateFood) {
		generateFood(grid)
	}
	else {
		let newTail = getNextCell(grid, tail) ;
		tail.state = 'empty';
		tail.direction = null;
		grid[tail.y][tail.x] = tail;
		tail = newTail;
	}
	
	board.innerHTML = refreshGame(grid);
}

function getNextCell(grid, cell) {
	if (cell.direction === null) {
		return cell;
	}
	
	const boardSize = grid.length;
	
	if (cell.direction === 'north') {
		let newY = cell.y === 0 ? boardSize - 1 : cell.y - 1
		return grid[newY][cell.x];
	}
	else if (cell.direction === 'east') {
		let newX = cell.x === boardSize - 1 ? 0 : cell.x + 1;
		return grid[cell.y][newX];
	}
	else if (cell.direction === 'south') {
		let newY = cell.y === boardSize - 1 ? 0 : cell.y + 1
		return grid[newY][cell.x];
	}
	else if (cell.direction === 'west') {
		let newX = cell.x === 0 ? boardSize - 1 : cell.x - 1
		return grid[cell.y][newX];
	}
}

function refreshGame(grid) {
	const boardSize = grid.length;
	let newBoard = '';
	
	for (let x = 0; x < boardSize; x++) {
		for (let y = 0; y < boardSize; y++) {
			const cell = grid[y][x];
			let div = document.createElement('div');
			div.classList.add('game-cell');

			if (cell.state === 'food') {
				div.classList.add('food-cell');
			}
			else if (cell.state === 'snake') {
				div.classList.add('snake-cell');
			}
			else if (cell.state === 'head') {
				div.classList.add('snake-cell', 'snake-head');
			}
			
			newBoard += div.outerHTML;
		}
	}
	
	return newBoard;
}

function initialise(boardSize) {
	const game = [];
	for (let y = 0; y < boardSize; y++) {
		const row = [];
		for (let x = 0; x < boardSize; x++) {
			row.push({
				x: x,
				y: y,
				state: 'empty',
				direction: null,
			})
		}
		game.push(row);
	}
	return game;
}

function generateFood(game) {
	const candidates = [];
	game.forEach(row => {
		row.forEach(cell => {
			if (cell.state === 'empty') {
				candidates.push(cell);
			}
		});
	});
	
	const foodCell = candidates[Math.round(Math.random() * candidates.length)]
	
	game[foodCell.y][foodCell.x].state = 'food';
	
	return game
}