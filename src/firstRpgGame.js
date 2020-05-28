import Phaser from 'phaser'

import BootScene  from './scenes/BootScene';


const config = {
	type: Phaser.AUTO,
	width: 320,
	height: 240,
	zoom: 2,
	pixelArt: true,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debag: true,
		}
	},
	scene: [BootScene],
	
}


export default config