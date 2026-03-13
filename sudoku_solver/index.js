window.addEventListener('DOMContentLoaded', (event) => {
	const gridSize = 9;

	generateGrid(gridSize);
});

function generateGrid(size) {
	const container = document.getElementById('sudoku-container');

	for (let row = 0; row < size; row++) {
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
		}
	}
}