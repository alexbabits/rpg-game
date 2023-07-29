export default class Menu extends Phaser.Scene{

    constructor(){
        super("Menu");
    }

    preload(){
    }

    create(data){
        this.gameState = data.gameState;
        this.menuBackground = this.add.sprite(this.game.config.width/2, this.game.config.height/2, 'bag').setScale(2.0, 4.0);

        this.menuOptions = ['Resume', 'Controls', 'Save', 'Load', 'Quit'];
        this.buttons = [];
        let startX = this.game.config.width/2;
        let startY = this.game.config.height/2 - 100;
        for (let i = 0; i < this.menuOptions.length; i++) {
            let x = startX;
            let y = startY + i * 50; 
            let button = this.setupButtons(x, y, this.menuOptions[i], i);
            this.buttons.push(button);
        }

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.stop();
            this.scene.resume(this.gameState.getCurrentMap());
            this.scene.resume('InventoryDisplay');
            this.scene.resume('EquipmentDisplay');
        });
    }

    setupButtons(x, y, text, index) {
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
                this.handleLoadButtonClick();
                break;
            case 4:
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
        this.scene.resume('InventoryDisplay');
        this.scene.resume('EquipmentDisplay');
    }

    handleControlsButtonClick() {
        this.scene.start('ControlsScene', { returnScene: this.scene.key });
    }

    async handleSaveButtonClick() {
        console.log('Save button pressed');
        
        let player = this.gameState.player;
        let inventory = this.gameState.inventory;
        let equipment = this.gameState.equipment;
    
        this.gameState.savePlayerState(player);
        this.gameState.saveInventoryState(inventory);
        this.gameState.saveEquipmentState(equipment);
        await this.gameState.saveToFile();
        
        console.log('Game Saved');
    }
    
    async handleLoadButtonClick() {
        this.scene.stop();
        this.scene.start('LoadScene', { returnScene: this.scene.key });
    }

    handleQuitButtonClick() {
        for (let key in this.scene.manager.scenes) {
            if (key !== 'StartScreen') {
                this.scene.manager.scenes[key].scene.stop();
            }
        }
        this.scene.start('StartScreen')
    }
}

/*
export class ControlsScene extends Phaser.Scene {
    constructor() {
        super("ControlsScene");
    }

    create(data) {
        this.returnScene = data.returnScene;
        this.controlsBackground = this.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'controlsbackground');

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
*/