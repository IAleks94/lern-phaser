import Phaser from 'phaser';

const style = { color: '#ffffff', align: 'left', fontSize: 15 };

export default class MenuItem extends Phaser.GameObjects.Text {
  constructor(x, y, text, scene) {
    super(scene, x, y, text, style);
  }
  select() {
    this.setColor('#f8ff38');
  }

  deselect() {
    this.setColor('#ffffff');
  }
  // когда связанный враг или игрок убит
  unitKilled() {
    this.active = false;
    this.visible = false;
  }
}
