export default class Menu extends Phaser.Scene{

    constructor(){
        super("Menu");
    }

    preload(){
        this.load.image('controlsbackground','assets/images/controlsbackground.png');
    }

    create(data){
        this.gameState = data.gameState;
        this.menuBackground = this.add.sprite(this.game.config.width/2, this.game.config.height/2, 'bag').setScale(2.0, 3.0);

        this.menuOptions = ['Resume', 'Controls', 'Save', 'Quit'];
        this.buttons = [];
        let startX = this.game.config.width/2;
        let startY = this.game.config.height/2 - 75;
        for (let i = 0; i < this.menuOptions.length; i++) {
            let x = startX;
            let y = startY + i * 50; 
            let button = this.setupButton(x, y, this.menuOptions[i], i);
            this.buttons.push(button);
        }

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.stop();
            this.scene.resume(this.gameState.getCurrentMap());
        });
    }

    setupButton(x, y, text, index) {
        let buttonSprite = this.add.sprite(x, y, 'items', 11).setScale(1.4).setInteractive().setScale(3.0, 1);
        buttonSprite.index = index;
        buttonSprite.on('pointerover', () => {buttonSprite.setTint(0x9e733f); buttonSprite.setData('hovered', true)});
        buttonSprite.on('pointerout', () => {buttonSprite.clearTint(); buttonSprite.setData('hovered', false)});
        buttonSprite.on('pointerdown', () => {this.handleButtonClick(index)});

        let buttonText = this.add.text(x, y, text, { fontSize: '16px', fontFamily: 'Arial', fill: '#000', resolution: 4 }).setOrigin(0.5, 0.5);

        return { sprite: buttonSprite, text: buttonText };
    }

    handleButtonClick(index) {
        switch(index) {
            case 0:
                this.handleResumeButtonClick();
                break;
            case 1:
                this.handleControlsButtonClick();
                break;
            case 2:
                this.handleSaveButtonClick();
                break;
            case 3:
                this.handleQuitButtonClick();
                break;
            default:
                console.log(`Something went wrong with handleButtonClick.`);
                break;
        }
    }
    
    handleResumeButtonClick() {
        this.scene.stop();
        this.scene.resume(this.gameState.getCurrentMap());
    }

    handleControlsButtonClick() {
        this.scene.start('Controls');
    }

    handleSaveButtonClick() {
        console.log('Save button pressed')
    }

    handleQuitButtonClick() {
        console.log('Quit button pressed')
    }
}


export class Controls extends Phaser.Scene {
    constructor() {
        super("Controls");
    }

    create() {
        this.controlsBackground = this.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'controlsbackground');

        this.add.text(320, 100, 'WASD/Arrow Keys - Move', { fontSize: '32px', fontFamily: 'Arial', fill: '#000', resolution: 4 }).setOrigin(0.5, 0.5);
        this.add.text(320, 175, 'I - Inventory', { fontSize: '32px', fontFamily: 'Arial', fill: '#000', resolution: 4 }).setOrigin(0.5, 0.5);
        this.add.text(320, 250, 'C - Character', { fontSize: '32px', fontFamily: 'Arial', fill: '#000', resolution: 4 }).setOrigin(0.5, 0.5);
        this.add.text(320, 325, 'Space - Attack', { fontSize: '32px', fontFamily: 'Arial', fill: '#000', resolution: 4 }).setOrigin(0.5, 0.5);
        this.add.text(320, 400, 'Ctrl+Space - Special Attack', { fontSize: '32px', fontFamily: 'Arial', fill: '#000', resolution: 4 }).setOrigin(0.5, 0.5);
        this.add.text(320, 475, 'Shift - Run', { fontSize: '32px', fontFamily: 'Arial', fill: '#000', resolution: 4 }).setOrigin(0.5, 0.5);
        this.add.text(320, 550, 'Esc - Exit/Back', { fontSize: '32px', fontFamily: 'Arial', fill: '#000', resolution: 4 }).setOrigin(0.5, 0.5);


        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.stop();
            this.scene.start("Menu");
        });
    }
}