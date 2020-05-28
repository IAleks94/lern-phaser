import Phaser from 'phaser';

import MenuItem from './MenuItem';

export default class Menu extends Phaser.GameObjects.Container {
  constructor(x, y, scene, heroes) {
    super(scene);
    this.menuItems = [];
    this.menuItemIndex = 0;
    this.heroes = heroes;
    this.x = x;
    this.y = y;
    this.selected = false;
  }

  addMenuItem(unit) {
    console.log('unit: ', unit);
    const menuItem = new MenuItem(0, this.menuItems.length * 20, unit, this.scene);
    this.menuItems.push(menuItem);
    this.add(menuItem);
    return menuItem;
  }
  // навигация по меню
  moveSelectionUp() {
    this.menuItems[this.menuItemIndex].deselect();
    do {
      this.menuItemIndex--;
      if (this.menuItemIndex < 0) this.menuItemIndex = this.menuItems.length - 1;
    } while (!this.menuItems[this.menuItemIndex].active);
    this.menuItems[this.menuItemIndex].select();
  }

  moveSelectionDown() {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex++;
    if (this.menuItemIndex >= this.menuItems.length) this.menuItemIndex = 0;
    this.menuItems[this.menuItemIndex].select();
  }
  // выбрать меню целиком и подсветить текущий элемент
  select(index) {
    if (!index) {
      index = 0;
    }
    this.menuItems[this.menuItemIndex].deselect();
    
    this.menuItemIndex = index;
    while (!this.menuItems[this.menuItemIndex].active) {
      this.menuItemIndex++;
      if (this.menuItemIndex >= this.menuItems.length) {
        this.menuItemIndex = 0;
      }
      if (this.menuItemIndex === index) {
        return;
      }
    }
    this.menuItems[this.menuItemIndex].select();
    this.selected = true;
  }
  // отменить выбор этого меню
  deselect() {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = 0;
    this.selected = false;
  }
  // очищаем меню и удаляем все пункты
  clear() {
    this.menuItems.forEach((item) => item.destroy());
    this.menuItems.length = 0;
    this.menuItemIndex = 0;
  }
  // пересоздаем пункты меню
  remap(units) {
    this.clear();
    // for (var i = 0; i < units.length; i++) {
    //   var unit = units[i];
    //   this.addMenuItem(unit.type);
    // }
    units.forEach((item) => item.setMenuItem(this.addMenuItem(item.type)));
    this.menuItemIndex = 0;
  }
}
