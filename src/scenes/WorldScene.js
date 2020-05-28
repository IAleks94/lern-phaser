import Phaser from 'phaser';

import * as C from './constants';

export default class WorldScene extends Phaser.Scene {
  constructor() {
    super('WorldScene');
    this.map = null;
    this.tiles = null;
    this.grass = null;
    this.obstacles = null;
    this.player = null;
    this.cursors = null;
    this.cameras = null;
    this.spawns = null;
  }

  createMap() {
    this.map = this.make.tilemap({ key: C.MAP_KEY });

    this.tiles = this.map.addTilesetImage('spritesheet', C.TILES_KEY);
    this.grass = this.map.createStaticLayer(C.GRASS_KEY, this.tiles, 0, 0);
    this.obstacles = this.map.createStaticLayer(C.OBSTACLES_KEY, this.tiles, 0, 0);
    this.obstacles.setCollisionByExclusion([-1]);

    this.physics.world.bounds.width = this.map.widthInPixels;
    this.physics.world.bounds.height = this.map.heightInPixels;
  }

  createPlayer() {
    this.player = this.physics.add.sprite(50, 100, C.PLAYER_KEY, 6);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.obstacles);
    // анимация клавиши 'left' для персонажа
    // мы используем одни и те же спрайты для левой и правой клавиши, просто зеркалим их
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers(C.PLAYER_KEY, { frames: [1, 7, 1, 13] }),
      frameRate: 10,
      repeat: -1,
    });

    // анимация клавиши 'right' для персонажа
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers(C.PLAYER_KEY, { frames: [1, 7, 1, 13] }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers(C.PLAYER_KEY, { frames: [2, 8, 2, 14] }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers(C.PLAYER_KEY, { frames: [0, 6, 0, 12] }),
      frameRate: 10,
      repeat: -1,
    });
  }

  createCamera() {
    // ограничиваем камеру размерами карты
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    // заставляем камеру следовать за игроком
    this.cameras.main.startFollow(this.player);
    //своего рода хак, чтобы предотвратить пояление полос в тайлах
    this.cameras.main.roundPixels = true;
  }

  onMeetEnemy(player, zone) {
    // мы перемещаем зону в другое место
    zone.x = Phaser.Math.Between(0, this.physics.world.bounds.width);
    zone.y = Phaser.Math.Between(0, this.physics.world.bounds.height);

    // встряхиваем мир
    this.cameras.main.shake(300);
    // вспышка на мир
    // this.cameras.main.flash(1000);
    // исчезновение мира (прям совсем)
    // this.cameras.main.fade(1000);
    // начало боя
    // переключаемся на  BattleScene
    this.scene.switch('BattleScene');
  }

  createSpawns() {
    this.spawns = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
    for (let i = 0; i < 30; i++) {
      let x = Phaser.Math.Between(0, this.physics.world.bounds.width);
      let y = Phaser.Math.Between(0, this.physics.world.bounds.height);
      // параметры: x, y, width, height
      this.spawns.create(x, y, 20, 20);
    }
    this.physics.add.overlap(this.player, this.spawns, this.onMeetEnemy, false, this);
  }

  wake() {
    this.cursors.left.reset();
    this.cursors.right.reset();
    this.cursors.up.reset();
    this.cursors.down.reset();
  }

  create() {
    this.createMap();
    this.createPlayer();
    this.createCamera();
    this.cursors = this.input.keyboard.createCursorKeys();
    this.createSpawns();

    this.sys.events.on('wake', this.wake, this);
  }

  update() {
    this.player.body.setVelocity(0);

    // горизонтальное перемещение
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-80);
      this.player.anims.play('left', true);
      this.player.flipX = true; //Разворачиваем спрайты персонажа вдоль оси X
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(80);
      this.player.anims.play('right', true);
      this.player.flipX = false; //Отменяем разворот спрайтов персонажа вдоль оси X
    } else if (this.cursors.up.isDown) {
      // вертикальное перемещение
      this.player.body.setVelocityY(-80);
      this.player.anims.play('up', true);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(80);
      this.player.anims.play('down', true);
    } else {
      this.player.anims.stop();
    }
  }
}
