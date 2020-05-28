// import Phaser from 'phaser';

import Menu from './Menu';

export class HeroesMenu extends Menu {}

export class ActionsMenu extends Menu {
  constructor(x, y, scene) {
    super(x, y, scene);
    this.addMenuItem('Атака');
  }
  confirm() {
    this.scene.events.emit('SelectedAction')
  }
}

export class EnemiesMenu extends Menu {
  confirm() {
    this.scene.events.emit("Enemy", this.menuItemIndex);
  }
}
