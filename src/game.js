export default class Game {
	static points = { // кол-во удаленных линий = кол-во очков
		'1': 40,
		'2': 100,
		'3': 300,
		'4': 1200
	};

	constructor() {
		this.reset();
	}

	get level() {
		return Math.floor(this.lines * 0.1);
	}

	// возвращение состояния игрового поля для отображения
	getState() {
		const playfield = this.createPlayfield();
		const { y: pieceY, x: pieceX, blocks } = this.activePiece; //реструктуризация

		for (let y = 0; y < this.playfield.length; y++) {
			playfield[y] = [];

			for (let x = 0; x < this.playfield[y].length; x++) {
				playfield[y][x] = this.playfield[y][x];
			}
		}

		// копирование значений из активной фигуры в массив playfield
		for (let y = 0; y < blocks.length; y++) {
			for (let x = 0; x < blocks[y].length; x++) {
				if (blocks[y][x]) {
					playfield[pieceY + y][pieceX + x] = blocks[y][x];
				}
			}
		}

		return { // возврат значений
			score: this.score,
			level: this.level,
			lines: this.lines,
			nextPiece: this.nextPiece,
			playfield,
			isGameOver: this.topOut
		};
	}

	reset() {
		this.score = 0;
		this.lines = 0;
		this.topOut = false; // переменная, отвечающая за конец игрового поля
		
		// игровое поле
		this.playfield = this.createPlayfield(); // вызов метода
		this.activePiece = this.createPiece(); // активная фигура и ее коодинаты (х и у)
		this.nextPiece = this.createPiece(); 
	}

	createPlayfield() { // создание игрового поля
		const playfield = [];

		for (let y = 0; y < 20; y++) {
			playfield[y] = [];

			for (let x = 0; x < 10; x++) {
				playfield[y][x] = 0;
			}
		}
		return playfield;
	}

	// метод, отвечающий за создание фигур разного типа
	createPiece() {
		const index = Math.floor(Math.random() * 7);
		const type = 'IJLOSTZ'[index];
		const piece = {};

		switch (type) {
			case 'I':
				piece.blocks = [
					[0, 0, 0, 0],
					[1, 1, 1, 1],
					[0, 0, 0, 0],
					[0, 0, 0, 0]
				];
				break;
			case 'J':
				piece.blocks = [
					[0, 0, 0],
					[2, 2, 2],
					[0, 0, 2]
				];
				break;
			case 'L':
				piece.blocks = [
					[0, 0, 0],
					[3, 3, 3],
					[3, 0, 0]
				];
				break;
			case 'O':
				piece.blocks = [
					[0, 0, 0, 0],
					[0, 4, 4, 0],
					[0, 4, 4, 0],
					[0, 0, 0, 0]
				];
				break;
			case 'S':
				piece.blocks = [
					[0, 0, 0],
					[0, 5, 5],
					[5, 5, 0]
				];
				break;
			case 'T':
				piece.blocks = [
					[0, 0, 0],
					[6, 6, 6],
					[0, 6, 0]
				];
				break;
			case 'Z':
				piece.blocks = [
					[0, 0, 0],
					[7, 7, 0],
					[0, 7, 7]
				];
				break;
			default:
				throw new Error('Неизвестный тип фигуры');
		}

		piece.x = Math.floor((10 - piece.blocks[0].length) / 2); // центрирование
		piece.y = -1;

		return piece;
	}

	// методы для движений

	movePieceLeft() {  //влево
		this.activePiece.x -= 1;

		if (this.hasCollision()) { //условие-проверка, вышла ли фигура за пределы поля
			this.activePiece.x += 1; //возврат фигуры
		}
	}

	movePieceRight() { //вправо
		this.activePiece.x += 1;

		if (this.hasCollision()) { //условие-проверка, вышла ли фигура за пределы поля
			this.activePiece.x -= 1; //возврат фигуры
		}
	}

	movePieceDown() {  //вниз
		if (this.topOut) return;

		this.activePiece.y += 1;

		if (this.hasCollision()) { //условие-проверка, вышла ли фигура за пределы поля
			this.activePiece.y -= 1; //возврат фигуры
			this.lockPiece(); // вызов метода lockPiece
			const clearedLines = this.clearLines(); // вызов метода clearLines
			this.updateScore(clearedLines);
			this.updatePieces(); // вызов метода updatePieces
		}

		if (this.hasCollision()) {
			this.topOut = true;
		}
	}

	// метод, меняющий номер актуальной конфигурации объекта

	rotatePiece() {
		this.rotateBlocks(); // фигура будет поворачиваться до вызова метода hasCollision

		// поворот фигуры в обратном направлении
		if (this.hasCollision()) { // если есть столкновение, вызываем метод hasCollision
			this.rotateBlocks(false); // вызываем метод rotateBlocks со значением false
		}
	}

	// вспомогательный метод с возможностью поворота фигуры по часовой стрелке и против часовой

	rotateBlocks(clockwise = true) { // метод, который по умолчанию будет поворачивать фигуру по часовой стрелке
		const blocks = this.activePiece.blocks; // Получили доступ к блокам
		const length = blocks.length;
		const x = Math.floor(length / 2); // находим половину длины массива
		const y = length - 1; // на одно значение меньше, чем длина массива

		// поворот фигуры с использованием временной переменной
		for (let i = 0; i < x; i++) {
			for (let j = i; j < y - i; j++) {
				const temp = blocks[i][j]; // поместили промежуточное значение

				// проверка значения clockwise
				if (clockwise) {  // если true, то фигура поворачивается по часовой стрелке
					blocks[i][j] = blocks[y - j][i];
					blocks[y - j][i] = blocks[y - i][y - j];
					blocks[y - i][y - j] = blocks[j][y - i];
					blocks[j][y - i] = temp;
				} else { // в противном случае 
					blocks[i][j] = blocks[j][y - i];
					blocks[j][y - i] = blocks[y - i][y - j];
					blocks[y - i][y - j] = blocks[y - j][i];
					blocks[y - j][i] = temp;
				}
			}
		}
	}

	// метод для проверки выхода за поле

	hasCollision() {
		const { y: pieceY, x: pieceX, blocks } = this.activePiece; //реструктуризация

		for (let y = 0; y < this.activePiece.blocks.length; y++) { //перебор рядов
			for (let x = 0; x < blocks[y].length; x++) { //перебор внутренних массивов (ряда)
				if (
					blocks[y][x] &&
					((this.playfield[pieceY + y] === undefined || this.playfield[pieceY + y][pieceX + x] === undefined) || //условие-проверка значений на undefined
						this.playfield[pieceY + y][pieceX + x]) // проверка, свободно ли место
				) {
					return true;
				}
			}
		}
		return false;
	}

	// метод переноса значения активной фигуры в игровое поле

	lockPiece() {
		const { y: pieceY, x: pieceX, blocks } = this.activePiece; //реструктуризация

		//перебор массива у активной фигуры
		for (let y = 0; y < this.activePiece.blocks.length; y++) { //перебор рядов
			for (let x = 0; x < blocks[y].length; x++) { //перебор внутренних массивов (ряда)
				if (blocks[y][x]) {
					this.playfield[pieceY + y][pieceX + x] = blocks[y][x]; //копирование значений из blocks в playfield
				}
			}
		}
	}

	// метод, очищающий линии

	clearLines() {
		const rows = 20;
		const columns = 10;
		let lines = [];

		// просмотр, сколько заполнено рядов
		for (let y = rows - 1; y >= 0; y--) {
			let numberOfBlocks = 0;

			for (let x = 0; x < columns; x++) {
				if (this.playfield[y][x]) {
					numberOfBlocks += 1;
				}
			}

			// добавляем ряды для удаления в массив
			if (numberOfBlocks === 0) {
				break;
			} else if (numberOfBlocks < columns) {
				continue;
			} else if (numberOfBlocks === columns) {
				lines.unshift(y); // добавляем индекс ряда в массив lines (в начало)
			}
		}

		for (let index of lines) {
			this.playfield.splice(index, 1); //удаление массива(рядов)
			this.playfield.unshift(new Array(columns).fill(0)); //добавить сверху новый ряд
		}

		return lines.length;
	}

	// метод изменения счета

	updateScore(clearedLines) {
		if (clearedLines > 0) {
			this.score += Game.points[clearedLines] * (this.level + 1);
			this.lines += clearedLines;
		}
	}

	// метод, обновляющий свойства activePiece и nextPiece

	updatePieces() {
		this.activePiece = this.nextPiece;
		this.nextPiece = this.createPiece();
	}
}