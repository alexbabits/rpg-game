import Player from './Player.js';
import InventoryData from './InventoryData.js';
import EquipmentData from './EquipmentData.js';

export default class LoadScene extends Phaser.Scene {
    constructor(gameState){
        super("LoadScene");
        this.gameState = gameState;
    }

    create(data) {
        this.returnScene = data.returnScene;
        this.loadBackground = this.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'purplebackground');
        this.createButtons();
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.stop();
            this.scene.start(this.returnScene);
        });
    }

    async createButtons() {
        const labels = ['Slot 1', 'Slot 2', 'Slot 3'];
        const yPos = [100, 300, 500];
        const stats = await this.gameState.getSaveSlotStatistics();
    
        labels.forEach((label, index) => {
            let buttonClickedMethod;
            const y = yPos[index];
            const buttonRectangle = this.add.rectangle(this.game.config.width / 2, y, 600, 160, 0xcbdbfc).setInteractive();
            buttonRectangle.on('pointerover', () => buttonRectangle.setFillStyle(0xa3bffa));
            buttonRectangle.on('pointerout', () => buttonRectangle.setFillStyle(0xcbdbfc));
    
            const buttonText = this.add.text(120, y, label, { fontSize: '48px', fontFamily: 'Arial', fill: '#452840', resolution: 4 }).setOrigin(0.5, 0.5);
            const buttonContainer = this.add.container(0, 0, [buttonRectangle, buttonText]);
    
            if (label === `Slot 1`) {
                buttonClickedMethod = this.loadGame1.bind(this);
                if (stats === null) {
                  const emptyText = this.add.text(this.game.config.width / 2, y, 'Empty', { fontSize: '48px', fontFamily: 'Arial', fill: '#452840', resolution: 4 }).setOrigin(0.5, 0.5);
                  buttonContainer.add([emptyText]);
                } else {
                  const timestampText = this.add.text(360, y + 30, `${stats.timestamp}`, { fontSize: '24px', fontFamily: 'Arial', fill: '#000', resolution: 4 }).setOrigin(0.5, 0.5);
                  const levelText = this.add.text(360, y - 30, `Player Level: ${stats.level}`, { fontSize: '24px', fontFamily: 'Arial', fill: '#000', resolution: 4 }).setOrigin(0.5, 0.5);
                  const mapText = this.add.text(360, y, `Location: ${stats.currentMap}`, { fontSize: '24px', fontFamily: 'Arial', fill: '#000', resolution: 4 }).setOrigin(0.5, 0.5);
              
                  buttonContainer.add([timestampText, levelText, mapText]);
                }
            } else {
                const emptyText = this.add.text(this.game.config.width / 2, y, 'Empty', { fontSize: '48px', fontFamily: 'Arial', fill: '#452840', resolution: 4 }).setOrigin(0.5, 0.5);
                buttonContainer.add([emptyText]);
                if (label === 'Slot 2') { buttonClickedMethod = this.loadGame2.bind(this); }
                else if (label === 'Slot 3') { buttonClickedMethod = this.loadGame3.bind(this); }
            }
    
            buttonRectangle.on('pointerdown', buttonClickedMethod);
        });
    }

    async loadGame1(){
        console.log('Load button pressed');
        const data = await this.gameState.loadFromFile();
        if (!data) {
            console.log('No save data found.');
            return;
        }

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