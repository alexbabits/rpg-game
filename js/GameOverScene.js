export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super("GameOverScene");
    }

    preload() {
        this.load.image('gameover', 'assets/images/gameover.png');
    }

    create() {
        this.add.image(0, 0, 'gameover').setOrigin(0).setScale(1);

        this.input.keyboard.on('keydown', () => {
            this.scene.stop('GameOverScene')
            this.scene.start('HomeScene')
        })
        this.input.on('pointerdown', () => {
            this.scene.stop('GameOverScene')
            this.scene.start('HomeScene')
        })
    }
}