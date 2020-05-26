import Phaser from 'phaser';



export default class ScoreLabel extends Phaser.GameObjects.Text {
    constructor(scene,score,  setCounter) { 
        super(scene);
        this.score = score;

        this.setCounter = setCounter
    }
    setScore(score) {
        this.score = score;
        this.updateScoreText();
    }

    add(points) {
        this.setScore(this.score + points);
        this.setCounter(this.score)
    }

    updateScoreText() {
        this.setText('')
    }
}