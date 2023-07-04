export default class HomeScene extends Phaser.Scene {
    constructor() {
        super("HomeScene");
    }

    preload() {
        this.load.image('homescene', 'assets/images/homescene.png');
    }

    create() {
        this.add.image(0, 0, 'homescene').setOrigin(0).setScale(1);

        this.input.keyboard.on('keydown', () => {
            this.scene.stop('HomeScene')
            this.scene.start('Map1')
        })
        this.input.on('pointerdown', () => {
            this.scene.stop('HomeScene')
            this.scene.start('Map1')
        })
    }
}
