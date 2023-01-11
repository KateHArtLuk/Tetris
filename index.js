import Game from './src/game.js'; // импорт класса Game
import View from './src/view.js'; // импорт класса View
import Controller from './src/controller.js'; // импорт класса Controller

const root = document.querySelector('#root'); // определяем элемент root

const game = new Game(); // создание константы Game
const view = new View(root, 480, 640, 20, 10); // создание константы view с элементом root, шириной, высотой, рядами и колонками
const controller = new Controller(game, view);

window.game = game; // получение доступа к объекту game
window.view = view; // получение доступа к объекту view
window.controller = controller; // получение доступа к объекту controller