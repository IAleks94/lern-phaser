import Phaser from 'phaser';

import BattleScene from './BattleScene';
import UIScene from './UIScene';
import WorldScene from './WorldScene';

import * as C from './constants';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // тайлы для карты
    this.load.image(C.TILES_KEY , 'assets/map/spritesheet.png');

    // карта в json формате
    this.load.tilemapTiledJSON(C.MAP_KEY, 'assets/map/map.json');

    // наши два персонажа (я лично увидел 4-х персонажей)
    this.load.spritesheet(C.PLAYER_KEY, 'assets/RPG_assets.png', {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.image(C.DRAGON_BLU_KEY, 'assets/dragonblue.png');
    this.load.image(C.DRAGON_ORANGE_KEY, 'assets/dragonorrange.png');
  }

  create() {
    // Подключаю остальные сцены (в массиве конфига почему то не выходило)
    this.game.scene.add('WorldScene', WorldScene);
    this.game.scene.add('BattleScene', BattleScene);
    this.game.scene.add('UIScene', UIScene);
    //Запускаем сцену мира
    this.scene.start('WorldScene');
  }
}
