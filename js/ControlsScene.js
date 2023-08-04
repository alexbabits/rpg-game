export default class ControlsScene extends Phaser.Scene {
    constructor() {
        super("ControlsScene");
    }

    create(data) {
        this.returnScene = data.returnScene;
        this.purplebackground = this.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'purplebackground');

        this.add.text(320, 80, 'WASD/Arrow Keys - Move', { fontSize: '32px', fontFamily: 'Arial', fill: '#cbdbfc', resolution: 2 }).setOrigin(0.5, 0.5);
        this.add.text(320, 150, 'I - Inventory', { fontSize: '32px', fontFamily: 'Arial', fill: '#cbdbfc', resolution: 2 }).setOrigin(0.5, 0.5);
        this.add.text(320, 220, 'C - Character', { fontSize: '32px', fontFamily: 'Arial', fill: '#cbdbfc', resolution: 2 }).setOrigin(0.5, 0.5);
        this.add.text(320, 290, 'Space - Attack', { fontSize: '32px', fontFamily: 'Arial', fill: '#cbdbfc', resolution: 2 }).setOrigin(0.5, 0.5);
        this.add.text(320, 360, 'Ctrl+Space - Special Attack', { fontSize: '32px', fontFamily: 'Arial', fill: '#cbdbfc', resolution: 2 }).setOrigin(0.5, 0.5);
        this.add.text(320, 430, 'Shift - Run', { fontSize: '32px', fontFamily: 'Arial', fill: '#cbdbfc', resolution: 2 }).setOrigin(0.5, 0.5);
        this.add.text(320, 500, 'J - Journal', { fontSize: '32px', fontFamily: 'Arial', fill: '#cbdbfc', resolution: 2 }).setOrigin(0.5, 0.5);
        this.add.text(320, 570, 'Esc - Exit/Back', { fontSize: '32px', fontFamily: 'Arial', fill: '#cbdbfc', resolution: 2 }).setOrigin(0.5, 0.5);

        this.input.keyboard.on('keydown-ESC', () => this.returnToPreviousScene());
        this.createBackButton();
    }

    createBackButton(){
        const backButtonRectangle = this.add.rectangle(60, 610, 80, 40, 0xcbdbfc).setInteractive();
        this.add.text(60, 610, 'Back', { font: '24px Arial', fill: '#452840', resolution: 2 }).setOrigin(0.5, 0.5);
        backButtonRectangle.on('pointerover', () => backButtonRectangle.setFillStyle(0xa3bffa));
        backButtonRectangle.on('pointerout', () => backButtonRectangle.setFillStyle(0xcbdbfc));
        backButtonRectangle.on('pointerdown', () => this.returnToPreviousScene());
    }

    returnToPreviousScene(){
        this.scene.stop();
        this.scene.start(this.returnScene);
    }

}