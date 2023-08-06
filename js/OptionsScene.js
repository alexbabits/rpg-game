export default class OptionsScene extends Phaser.Scene {
    constructor() {
        super("OptionsScene");
    }

    create(data) {
        this.returnScene = data.returnScene;
        this.purplebackground = this.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'purplebackground');
        this.add.rectangle(90, 320, 180, 640, 0x36454F).setOrigin(0.5,0.5)
        const y = [50, 110, 170, 230, 290, 350, 410, 470, 530]
        const actions = ['Movement', 'Sprint', 'Attack', 'Special Attack', 'Inventory', 'Character', 'Journal', 'Message Box', 'Exit/Back']
        const keys = ['WASD/UDLR', 'Shift', 'Space', 'Ctrl+Space', 'I', 'C',  'J', 'K', 'Esc']
        for (let i = 0; i < actions.length; i++) {
            this.add.text(300, y[i], actions[i], { font: '24px Arial', fill: '#cbdbfc', resolution: 2 }).setOrigin(0.5);
        }
        for (let i = 0; i < keys.length; i++) {
            this.add.text(520, y[i], keys[i], { font: '24px Arial', fill: '#cbdbfc', resolution: 2 }).setOrigin(0.5);
        }

        this.input.keyboard.on('keydown-ESC', () => this.returnToPreviousScene());

        this.createButtons();
    }

    createButtons() {
        const yCoords = [610, 150, 200, 250];
        const widths = [80, 100, 100, 100];
        const labels = ['Back', 'Controls', 'Graphics', 'Audio'];
        const actions = [() => this.returnToPreviousScene(), () => this.launchControls(), () => this.launchGraphics(), () => this.launchAudio()];
    
        for (let i = 0; i < labels.length; i++) {
            const buttonRectangle = this.add.rectangle(90, yCoords[i], widths[i], 40, 0xcbdbfc).setInteractive();
            this.add.text(90, yCoords[i], labels[i], { font: '22px Arial', fill: '#452840', resolution: 2 }).setOrigin(0.5, 0.5);
            buttonRectangle.on('pointerover', () => buttonRectangle.setFillStyle(0xa3bffa));
            buttonRectangle.on('pointerout', () => buttonRectangle.setFillStyle(0xcbdbfc));
            buttonRectangle.on('pointerdown', actions[i]);
        }
    }

    launchControls(){
        //transitions to controls scene
    }
    launchGraphics(){
        //transitions to graphics scene
    }
    launchAudio(){
        //transitions to audio scene
    }

    returnToPreviousScene(){
        this.scene.stop();
        this.scene.start(this.returnScene);
    }

}