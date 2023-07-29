import Player from './Player.js';
import InventoryData from './InventoryData.js';
import EquipmentData from './EquipmentData.js';

export default class LoadScene extends Phaser.Scene {
    constructor(gameState){
        super("LoadScene");
        this.gameState = gameState;
    }

    async create(data) {
        this.returnScene = data.returnScene;
        this.loadBackground = this.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'controlsbackground');
        this.createButtons();
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.stop();
            this.scene.start(this.returnScene);
        });
        const stats = await this.gameState.getSaveSlotStatistics();
        this.add.text(100, 100, `Save Time: ${stats.timestamp}`, { font: '16px Arial', fill: '#ffffff' });
        this.add.text(200, 200, `Player Level: ${stats.level}`);
    }

    createButtons() {
        const labels = ['Slot 1', 'Slot 2', 'Slot 3'];
        const yPos = [this.game.config.height/2, this.game.config.height/2 + 60, this.game.config.height/2 + 120];
    
        labels.forEach((label, index) => {
            let buttonClickedMethod;
            const y = yPos[index];
            const buttonRectangle = this.add.rectangle(this.game.config.width / 2, y, 200, 50, 0xcbdbfc).setInteractive();
            buttonRectangle.on('pointerover', () => buttonRectangle.setFillStyle(0xa3bffa));
            buttonRectangle.on('pointerout', () => buttonRectangle.setFillStyle(0xcbdbfc));
            
            if (label === 'Slot 1') { buttonClickedMethod = this.loadGame1.bind(this); }
            else if (label === 'Slot 2') { buttonClickedMethod = this.loadGame2.bind(this); }
            else if (label === 'Slot 3') { buttonClickedMethod = this.loadGame3.bind(this); }
    
            buttonRectangle.on('pointerdown', buttonClickedMethod);
    
            const buttonText = this.add.text(320, y, label, { fontSize: '24px', fontFamily: 'Arial', fill: '#452840', resolution: 4 }).setOrigin(0.5, 0.5);
            this.add.container(0, 0, [buttonRectangle, buttonText]);
        });
    }

    async loadGame1(){
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

    loadGame2(){
        console.log('Load Slot 2 button pressed');
    }
    
    loadGame3(){
        console.log('Load Slot 3 button pressed');
    }

}