import Phaser from 'phaser';

import Unit from './Unit';

class Enemy extends Unit {}
class PlayerCharacter extends Unit {
  constructor(scene, x, y, texture, frame, type, hp, damage) {
    super(scene, x, y, texture, frame, type, hp, damage);
    this.flipX = true;
    this.setScale(2);
  }
}

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super('BattleScene');
    this.cameras = null;
    this.heroes = [];
    this.enemies = [];
    this.units = [];

    this.index = null;
  }

  createUnit(x, y, texture, frame, type, hp, damage) {
    let unit;
    if (texture === 'player') {
      unit = new PlayerCharacter(this, x, y, texture, frame, type, hp, damage);
      this.heroes.push(unit);
    } else {
      unit = new Enemy(this, x, y, texture, frame, type, hp, damage);
      this.enemies.push(unit);
    }
    this.add.existing(unit);
    this.units.push(unit);
  }

  //проверка на проигрыш или победу
  checkEndBattle() {
    let victory = true;
    // если все враги умерли - мы победили
    this.enemies.forEach((enemy) => {
      if (enemy.living) {
        victory = false;
      }
    });
    let gameOver = true;
    // если все герои умерли - мы проиграли
    this.heroes.forEach((hero) => {
      if (hero.living) {
        gameOver = false;
      }
    });
    return victory || gameOver;
  }

  endBattle() {
    // очищаем состояния, удаляем спрайты
    this.heroes.length = 0;
    this.enemies.length = 0;
    for (let i = 0; i < this.units.length; i++) {
      // ссылки на экземпляры юнитов
      this.units[i].destroy();
    }
    this.units.length = 0;
     // отправляем сцену в сон (скрываем);
    this.scene.sleep('UIScene');
    // возвращаемся в WorldScene и скрываем BattleScene
    this.scene.switch('WorldScene');
  }

  nextTurn() {
    //проверяем не настал ли уже проигрыш или победа
    if (this.checkEndBattle()) {
      this.endBattle();
      return;
    }
    do {
      this.index++;
      // если юнитов больше нет, то начинаем сначала с первого
      if (this.index >= this.units.length) {
        this.index = 0;
      }
    } while (!this.units[this.index].living);

    if (this.units[this.index]) {
      // если это герой игрока
      if (this.units[this.index] instanceof PlayerCharacter) {
        console.log('Игрок');
        // тут мы передаем в функцию выделения номер текущего игрока
        this.events.emit('PlayerSelect', this.index);
      } else {
        console.log('Враг');
        // иначе если это юнит врага
        // выбираем случайного героя
        const r = Math.floor(Math.random() * this.heroes.length);
        // и вызываем функцию атаки юнита врага
        this.units[this.index].attack(this.heroes[r]);
        // добавляем задержку на следующий ход, чтобы был плавный игровой процесс
        this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
      }
    }
  }

  receivePlayerSelection(action, target) {
    if (action === 'attack') {
      this.units[this.index].attack(this.enemies[target]);
    }
    this.time.addEvent({ delay: 2000, callback: this.nextTurn, callbackScope: this });
  }


  startBattle() {
    console.log('Начинаем битву');
    // персонаж игрока - warrior (воин)
    this.createUnit(250, 50, 'player', 1, 'Воин', 100, 20);
        // персонаж игрока - mage (маг)
    this.createUnit(250, 100, 'player', 4, 'Маг', 80, 8);

    this.createUnit(50, 50, 'dragonblue', null, 'Дракон', 8, 3);
    this.createUnit(50, 100, 'dragonorrange', null, 'Дракон2', 8, 3);

 // пробуждаем сцену отосна
   this.scene.wake('UIScene');

   this.index = -1; // текущий активный юнит     
}

  create() {
    this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)');

    this.startBattle()
     // Одновременно запускаем сцену UI Scene 
    this.scene.launch('UIScene');

    this.sys.events.on('wake', this.startBattle, this);
  }
}
