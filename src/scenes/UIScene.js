import Phaser from 'phaser';

import * as Menus from './UI/Menus';
import Message from './UI/Message';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
    this.graphics = null;
    this.menus = null;
    this.heroesMenu = null;
    this.actionsMenu = null;
    this.enemiesMenu = null;
    this.currentMenu = null;

    this.battleScene = null;

    this.message = null;
  }

  createBlock(x, y, width, height) {
    this.graphics.strokeRect(x, y, width, height);
    this.graphics.fillRect(x, y, width, height);
  }

  createGraphics() {
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(1, 0xffffff);
    this.graphics.fillStyle(0x031f4c, 1);

    this.createBlock(2, 150, 90, 100);
    this.createBlock(95, 150, 90, 100);
    this.createBlock(188, 150, 130, 100);
  }

  remapHeroes() {
    const heroes = this.battleScene.heroes;
    this.heroesMenu.remap(heroes);
  }
  remapEnemies() {
    const enemies = this.battleScene.enemies;
    this.enemiesMenu.remap(enemies);
  }

  createMenus() {
    this.menus = this.add.container();

    this.heroesMenu = new Menus.HeroesMenu(195, 153, this);
    this.actionsMenu = new Menus.ActionsMenu(100, 153, this);
    this.enemiesMenu = new Menus.EnemiesMenu(8, 153, this);

    // текущее выбранное меню
    this.currentMenu = this.actionsMenu;

    // добавление меню в контейнер
    this.menus.add(this.heroesMenu);
    this.menus.add(this.actionsMenu);
    this.menus.add(this.enemiesMenu);
  }

  onKeyInput(event) {
    if (this.currentMenu && this.currentMenu.selected) {
      if (event.code === 'ArrowUp') {
        this.currentMenu.moveSelectionUp();
      } else if (event.code === 'ArrowDown') {
        this.currentMenu.moveSelectionDown();
      } else if (event.code === 'ArrowRight' || event.code === 'Shift') {
      } else if (event.code === 'Space' || event.code === 'ArrowLeft') {
        this.currentMenu.confirm();
      }
    }
  }

  onPlayerSelect(id) {
    console.log('id: ', id);
    this.heroesMenu.select(id);
    this.actionsMenu.select(0);
    this.currentMenu = this.actionsMenu;
  }

  onSelectedAction() {
    this.currentMenu = this.enemiesMenu;
    this.enemiesMenu.select(0);
  }

  onEnemy(index) {
    this.heroesMenu.deselect();
    this.actionsMenu.deselect();
    this.enemiesMenu.deselect();
    this.currentMenu = null;
    this.battleScene.receivePlayerSelection('attack', index);
  }

  showMenu() {
    // перестроение пунктов меню для героев
    this.remapHeroes();
    // перестроение пунктов меню для врагов
    this.remapEnemies();
    // первый шаг
    this.battleScene.nextTurn();
  }

  create() {
    this.createGraphics();
    this.createMenus();

    this.battleScene = this.scene.get('BattleScene');

    this.input.keyboard.on('keydown', this.onKeyInput, this);

    //Обработчики эвента получают значение которое передаеться при создании эвента (мы тут явно не указываем его)
    this.battleScene.events.on('PlayerSelect', this.onPlayerSelect, this);
    this.events.on('SelectedAction', this.onSelectedAction, this);
    this.events.on('Enemy', this.onEnemy, this);
    // когда сцена получает событие wake
    this.sys.events.on('wake', this.showMenu, this);

    // сообщение, описывающее текущее действие
    this.message = new Message(this, this.battleScene.events);
    this.add.existing(this.message);

    this.showMenu();
  }
}
