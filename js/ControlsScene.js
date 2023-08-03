export default class ControlsScene extends Phaser.Scene {
    constructor() {
        super("ControlsScene");
    }

    create(data) {
        this.returnScene = data.returnScene;
        this.purplebackground = this.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'purplebackground');

        this.add.text(320, 100, 'WASD/Arrow Keys - Move', { fontSize: '32px', fontFamily: 'Arial', fill: '#cbdbfc', resolution: 4 }).setOrigin(0.5, 0.5);
        this.add.text(320, 175, 'I - Inventory', { fontSize: '32px', fontFamily: 'Arial', fill: '#cbdbfc', resolution: 4 }).setOrigin(0.5, 0.5);
        this.add.text(320, 250, 'C - Character', { fontSize: '32px', fontFamily: 'Arial', fill: '#cbdbfc', resolution: 4 }).setOrigin(0.5, 0.5);
        this.add.text(320, 325, 'Space - Attack', { fontSize: '32px', fontFamily: 'Arial', fill: '#cbdbfc', resolution: 4 }).setOrigin(0.5, 0.5);
        this.add.text(320, 400, 'Ctrl+Space - Special Attack', { fontSize: '32px', fontFamily: 'Arial', fill: '#cbdbfc', resolution: 4 }).setOrigin(0.5, 0.5);
        this.add.text(320, 475, 'Shift - Run', { fontSize: '32px', fontFamily: 'Arial', fill: '#cbdbfc', resolution: 4 }).setOrigin(0.5, 0.5);
        this.add.text(320, 550, 'Esc - Exit/Back', { fontSize: '32px', fontFamily: 'Arial', fill: '#cbdbfc', resolution: 4 }).setOrigin(0.5, 0.5);

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.stop();
            this.scene.start(this.returnScene);
        });
    }
}