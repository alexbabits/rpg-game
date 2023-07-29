import Player from './Player.js';
import InventoryData from './InventoryData.js';
import EquipmentData from './EquipmentData.js';

export default class LoadScene extends Phaser.Scene {
    constructor(gameState){
        super("LoadScene");
        this.gameState = gameState;
    }

    create(data){
        this.returnScene = data.returnScene;
        this.loadBackground = this.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'controlsbackground');
        this.setupLoadButtons();
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.stop();
            this.scene.start(this.returnScene);
        });
    }

    async loadGame(){
        console.log('Load button pressed');
        await this.gameState.loadFromFile();

        let player = new Player(this, 320, 320, this.gameState);
        let inventory = new InventoryData(this, this.gameState, player);
        let equipment = new EquipmentData(this, this.gameState, player);

        this.gameState.setPlayer(player);
        this.gameState.setInventory(inventory);
        this.gameState.setEquipment(equipment);

        this.gameState.loadPlayerState(player);
        this.gameState.loadInventoryState(inventory);
        this.gameState.loadEquipmentState(equipment);

        this.scene.stop('LoadScene');
        this.scene.start(this.gameState.getCurrentMap());
        console.log('Game Loaded');
    }

    setupLoadButtons() {
        const buttonWidth = 200;
        const buttonHeight = 50;
        const startX = 320;
        const startY = 340;
        const buttonSpacing = 60;
    
        for (let i = 0; i < 3; i++) {
            let y = startY + i * buttonSpacing;
            let loadButton = this.add.rectangle(startX, y, buttonWidth, buttonHeight, 0xcbdbfc).setInteractive();
            loadButton.on('pointerover', () => loadButton.setFillStyle(0xa3bffa));
            loadButton.on('pointerout', () => loadButton.setFillStyle(0xcbdbfc));
    
            if (i === 0) {
                loadButton.on('pointerdown', () => {
                    this.loadGame(); 
                });
            }
    
            const loadButtonText = this.add.text(startX, y, 'Slot ' + (i+1), { fontSize: '24px', fontFamily: 'Arial', fill: '#452840', resolution: 4 }).setOrigin(0.5, 0.5);
            this.add.container(0, 0, [loadButton, loadButtonText]);
        }
    }

}