import Phaser from 'phaser';

export default class Message extends Phaser.GameObjects.Container {
  constructor(scene, events) {
    console.log('events: ', events);
    super(scene, 160, 30);
    this.graphics = this.scene.add.graphics();
    this.graphics.lineStyle(1, 0xffffff, 0.8);
    this.graphics.fillStyle(0x031f4c, 0.3);
    this.graphics.strokeRect(-90, -15, 180, 30);
    this.graphics.fillRect(-90, -15, 180, 30);
    this.add(this.graphics);
    console.log(this);


    this.text = new Phaser.GameObjects.Text(scene, 0, 0, '', {
      color: '#ffffff',
      align: 'center',
      fontSize: 13,
      wordWrap: { width: 160, useAdvancedWrap: true },
    });
    this.add(this.text);
    this.text.setOrigin(0.5);
    events.on('Message', this.showMessage, this);
    this.visible = false;
  }
  showMessage(text) {
    this.text.setText(text);
    this.visible = true;
    if (this.hideEvent) {
      this.hideEvent.remove(false);
    }
      this.hideEvent = this.scene.time.addEvent({
        delay: 2000,
        callback: this.hideMessage,
        callbackScope: this,
      });
    
  }
  hideMessage() {
    this.hideEvent = null;
    this.visible = false;
  }
}
