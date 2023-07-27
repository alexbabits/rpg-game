export default class DeathScene extends Phaser.Scene {
    constructor() {
        super("DeathScene");
    }

    preload() {
        this.load.image('DeathScene', 'assets/images/DeathScene.png');
    }

    create() {
        this.add.image(0, 0, 'DeathScene').setOrigin(0).setScale(1);

        this.input.keyboard.on('keydown', () => {
            this.scene.stop('DeathScene')
            this.scene.start('StartScreen')
        })
        this.input.on('pointerdown', () => {
            this.scene.stop('DeathScene')
            this.scene.start('StartScreen')
        })
    }
}