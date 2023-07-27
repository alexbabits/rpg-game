export default class StartScreen extends Phaser.Scene {
    constructor(gameState) {
        super("StartScreen");
        this.gameState = gameState;
    }

    preload() {
        this.load.image('StartScreen', 'assets/images/StartScreen.png');
        this.load.image('controlsbackground','assets/images/controlsbackground.png');
    }

    create() {
        this.add.image(0, 0, 'StartScreen').setOrigin(0).setScale(1);
        this.setupNewButton();
        this.setupLoadButton();
        this.setupOptionsButton();
    }

    setupNewButton() {
        const newButton = this.add.rectangle(320, 480, 200, 50, 0xcbdbfc).setInteractive();
        newButton.on('pointerover', () => newButton.setFillStyle(0xa3bffa));
        newButton.on('pointerout', () => newButton.setFillStyle(0xcbdbfc));
        newButton.on('pointerdown', () => {
            this.scene.stop('StartScreen');
            this.gameState.playerState = null;
            this.gameState.inventoryState = null;
            this.gameState.equipmentState = null;
            this.gameState.currentMap = null;
            this.gameState.playerPosition = {x: 320, y: 320};
            this.gameState.playerDirection = 'Right';
            this.player = null;
            this.inventory = null;
            this.equipment = null;
            this.scene.start('Map1');
        });
        const newButtonText = this.add.text(320, 480, 'New', { fontSize: '24px', fontFamily: 'Arial', fill: '#452840', resolution: 4 }).setOrigin(0.5, 0.5);
        this.add.container(0, 0, [newButton, newButtonText]);
    }

    setupLoadButton(){
        const loadButton = this.add.rectangle(320, 540, 200, 50, 0xcbdbfc).setInteractive();
        loadButton.on('pointerover', () => loadButton.setFillStyle(0xa3bffa));
        loadButton.on('pointerout', () => loadButton.setFillStyle(0xcbdbfc));
        loadButton.on('pointerdown', () => {console.log(`Load Button Clicked.`)});
        const loadButtonText = this.add.text(320, 540, 'Load', { fontSize: '24px', fontFamily: 'Arial', fill: '#452840', resolution: 4 }).setOrigin(0.5, 0.5);
        this.add.container(0, 0, [loadButton, loadButtonText]);
    }

    setupOptionsButton() {
        const optionsButton = this.add.rectangle(320, 600, 200, 50, 0xcbdbfc).setInteractive();
        optionsButton.on('pointerover', () => optionsButton.setFillStyle(0xa3bffa));
        optionsButton.on('pointerout', () => optionsButton.setFillStyle(0xcbdbfc));
        optionsButton.on('pointerdown', () => {
            for (let key in this.scene.manager.scenes) {
                if (key !== 'Controls') {
                    this.scene.manager.scenes[key].scene.stop();
                }
            }
            this.scene.start('Controls', { returnScene: this.scene.key });
        });
        const optionsButtonText = this.add.text(320, 600, 'Options', { fontSize: '24px', fontFamily: 'Arial', fill: '#452840', resolution: 4 }).setOrigin(0.5, 0.5);
        this.add.container(0, 0, [optionsButton, optionsButtonText]);
    }
}