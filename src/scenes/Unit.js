import Phaser from 'phaser';

export default class Unit extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame, type, hp, damage) {
    super(scene, x, y, texture, frame, type, hp, damage);
    this.type = type;
    this.maxHp = this.hp = hp;
    this.damage = damage; // урон по умолчанию
    this.living = true;
    this.menuItem = null;
  }

  // мы будем использовать эту функцию, чтобы установить пункт меню, когда юнит умирает
  setMenuItem(item) {
    this.menuItem = item;
  }

  attack(target) {
    if(target.living) {
      target.takeDamage(this.damage);
      this.scene.events.emit("Message", this.type + " атакует " + target.type + " с " + this.damage + " уроном");
    }
    
  }

  takeDamage(damage) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.hp = 0;
      this.menuItem.unitKilled();
      this.living = false;
      this.visible = false;
      this.menuItem = null;
    }
  }
}
