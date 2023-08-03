export default class DeathScene extends Phaser.Scene {
    constructor() {
        super("DeathScene");
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