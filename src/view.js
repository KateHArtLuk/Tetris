export default class view {
	// создание статического свойства, в котором каждому числу будет соответствовать определенный цвет
	static colors = {
		'1': '#265B57',
		'2': '#17B6BC',
		'3': '#7FB069',
		'4': '#A30000',
		'5': '#FF7700',
		'6': '#EFD28D',
		'7': '#57467B'
	}

	constructor(element, width, height, rows, columns) {
		this.element = element;
		this.width = width;
		this.height = height;

		// создание холста 
		this.canvas = document.createElement('canvas');
		// ширина и высота холста
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		// получение контекста, с помощью которого мы будем рисовать на холсте
		this.context = this.canvas.getContext('2d');

		this.playfieldBorderWidth = 4; // ширина границы
		this.playfieldX = this.playfieldBorderWidth; // координаты начала поля по оси х
		this.playfieldY = this.playfieldBorderWidth; // координаты начала поля по оси у
		this.playfieldWidth = this.width * 2 / 3; // ширина игрового поля - 2/3 от общей ширины
		this.playfieldHeight = this.height; // высота игрового поля 
		this.playfieldInnerWidth = this.playfieldWidth - this.playfieldBorderWidth * 2; // внутренняя ширина игрового поля 
		this.playfieldInnerHeight = this.playfieldHeight - this.playfieldBorderWidth * 2; // внутренняя высота игрового поля 

		this.blockWidth = this.playfieldInnerWidth / columns; // ширина блока будет равна внутренней ширине разделить на кол-во колонок
		this.blockHeight = this.playfieldInnerHeight / rows; // высота блока будет равна внутренней высота разделить на кол-во рядов
		
		// свойства панели
		this.panelX = this.playfieldWidth + 10;
		this.panelY = 0
		this.panelWidth = this.width / 3; //ширина
		this.panelHeight = this.height; //высота

		// добавляем в элемент контекст, который мы создали
		this.element.appendChild(this.canvas);
	}

// метод, рисующий игровое поле

	renderMainScreen(state) {
		this.clearScreen(); // вызов вспомогательного метода clearScreen
		this.renderPlayfield(state); // вызов вспомогательного метода renderPlayfield
		this.renderPanel(state); // вызов метода renderPanel
	}

// экран начала

	renderStartScreen() {
		this.context.fillStyle = 'white';
		this.context.font = '18px "Press Start 2P"';
		this.context.textAlign = 'center';
		this.context.textBaseline = 'middle';
		this.context.fillText('Press ENTER to Start', this.width / 2, this.height / 2);
	}

// экран паузы

	renderPauseScreen() {
		this.context.fillStyle = 'rgba(0,0,0,0.75)';
		this.context.fillRect(0,0,this.width, this.height);

		this.context.fillStyle = 'white';
		this.context.font = '18px "Press Start 2P"';
		this.context.textAlign = 'center';
		this.context.textBaseline = 'middle';
		this.context.fillText('Press ENTER to Resume', this.width / 2, this.height / 2);
		
	}

// экран game over

	renderEndScreen({ score }) {
		this.clearScreen();

		this.context.fillStyle = 'white';
		this.context.font = '18px "Press Start 2P"';
		this.context.textAlign = 'center';
		this.context.textBaseline = 'middle';
		this.context.fillText('GAME OVER', this.width / 2, this.height / 2 - 48);
		this.context.fillText(`Score: ${score}`, this.width / 2, this.height / 2);
		this.context.fillText('Press ENTER to Restart', this.width / 2, this.height / 2 + 48);
	}
		
// вспомогательный метод

	clearScreen() {
		this.context.clearRect(0, 0, this.width, this.height); // очищение предыдущего состояния холста
	}

	renderPlayfield({ playfield }) {
		for (let y = 0; y < playfield.length; y++) { // перебор массива playfield
			const line = playfield[y]; // создание константы, в которой будет доставаться линия по индексу

			for (let x = 0; x < line.length; x++) { // перебор массива line
				const block = line[x]; // создание константы, полученной из line по индексу х
				
				// проверка, пустая ячейка или нет
				if (block) { // если нет, то будет рисоваться блок
					this.renderBlock(
						this.playfieldX + (x * this.blockWidth), 
						this.playfieldY + (y * this.blockHeight), 
						this.blockWidth, 
						this.blockHeight, 
						view.colors[block]
					);
				}
			}	
		}

		// Граница поля
		this.context.strokeStyle = '#F3EBB7';
		this.context.lineWidth = this.playfieldBorderWidth;
		this.context.strokeRect(0, 0, this.playfieldWidth, this.playfieldHeight);
	}

// метод для боковой панели

	renderPanel({ level, score, lines, nextPiece }) {
		this.context.textAlign = 'start'; // текст отформатирован по левому краю
		this.context.textBaseline = 'top'; // текст отформатирован по верхнему краю
		this.context.fillStyle = '#F3EBB7'; // цвет текста
		this.context.font = '14px "Press Start 2P"'; // шрифт
		
		// вывод текста на холст
		this.context.fillText(`Score: ${score}`, this.panelX, this.panelY + 0); 
		this.context.fillText(`Lines: ${lines}`, this.panelX, this.panelY + 24);
		this.context.fillText(`Level: ${level}`, this.panelX, this.panelY + 48);
		this.context.fillText('Next:', this.panelX, this.panelY + 96);
		
		// вывод следующей фигуры
		for (let y = 0; y < nextPiece.blocks.length; y++) {
			for (let x = 0; x < nextPiece.blocks[y].length; x++) {
				const block = nextPiece.blocks[y][x];

				if (block) {
					this.renderBlock(
						this.panelX + (x * this.blockWidth * 0.5),
						this.panelY + 100 + (y * this.blockHeight * 0.5),
						this.blockWidth * 0.5,
						this.blockHeight * 0.5,
						view.colors[block]
					);
				}
			}
		}
	}

	renderBlock(x, y, width, height, color) {
		this.context.fillStyle = color; // цвет заливки
		this.context.strokeStyle = 'black'; // цвет обводки
		this.context.lineWidth = 2; // ширина обводки

		this.context.fillRect(x, y, width, height); // рисование прямоугольника
		this.context.strokeRect(x, y, width, height); // обводка вокруг фигуры
	}
}