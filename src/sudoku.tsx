import { calcCellRealIndex } from "./SudokuCell";

function isRowValid(board: number[][], rowIndex: number): boolean {
	let numbersBitset = 0;

	for (let i = 0; i<9; i++) {
		const cellValue = board[rowIndex][i];
		if (cellValue == 0) {
			continue;
		}

		if (numbersBitset & (1 << cellValue)) {
			return false;
		}

		numbersBitset |= (1 << cellValue);
	}

	return true;
}


function isColumnValid(board: number[][], columnIndex: number): boolean {
	let numbersBitset = 0;

	for (let i = 0; i<9; i++) {
		const cellValue = board[i][columnIndex];
		if (cellValue == 0) {
			continue;
		}

		if (numbersBitset & (1 << cellValue)) {
			return false;
		}

		numbersBitset |= (1 << cellValue);
	}

	return true;
}

function getSubgridValidCells(board: number[][], subgridIndex: number, answer: number) {
	let indicies: [number, number][] = [];

	for (let i = 0; i<9; i++) {
		const cellIndex = calcCellRealIndex(subgridIndex, i);
		const originalCellValue = board[cellIndex[1]][cellIndex[0]];

		if (originalCellValue != 0 ) {
			continue;
		}
		board[cellIndex[1]][cellIndex[0]] = answer;

		if (isRowValid(board, cellIndex[1]) && isColumnValid(board, cellIndex[0])) {
			indicies.push(cellIndex);
		}

		board[cellIndex[1]][cellIndex[0]] = originalCellValue;
	}

	return indicies;
}

function randrange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
}

export function generateBoard(): number[][] {
	function generateBoardUncertain(): number[][] | null {
		let board: number[][] = [];

		for (let j = 0; j<9 ; j++) {
			let row: number[] = [];
			for (let i = 0; i<9 ; i++) {
				row.push(0);
			}
			board.push(row);
		}

		for (let digit = 1; digit <= 9; digit++) {
			for (let subgridIndex = 0; subgridIndex < 9; subgridIndex++) {
				const validCells = getSubgridValidCells(board, subgridIndex, digit);

				if (validCells.length == 0) {
					return null;
				}

				const cellIndex = randrange(0, validCells.length);
				const cell = validCells[cellIndex];
				board[cell[1]][cell[0]] = digit;
			}
		}

		return board;
	}

	let board: number[][] | null = null;
	while (board == null) {
		board = generateBoardUncertain();
	}

	return board;
}

export function removeCellsFromBoard(board: number[][], numberOfCells: number) {
	const availableCells: number[] = Array.from({ length: 81 }, (_, index) => index);

	for (let i = 0; i<numberOfCells; i++) {
		const cellListIndex = randrange(0, availableCells.length);
		const cellIndex = availableCells[cellListIndex];

		const cellX = cellIndex % 9;
		const cellY = Math.floor(cellIndex / 9);
		
		board[cellY][cellX] = 0;
		availableCells.splice(cellListIndex, 1);
	}
}
