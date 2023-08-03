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
            const loadButtonX = this.game.config.width / 2 + 200;
            const loadButtonY = y - 40;
            const loadButtonRectangle = this.add.rectangle(loadButtonX, loadButtonY, 100, 50, 0x00FF00).setInteractive();
            const loadButtonText = this.add.text(loadButtonX, loadButtonY, 'Load', { fontSize: '24px', fontFamily: 'Arial', fill: '#452840', resolution: 4 }).setOrigin(0.5, 0.5);

            loadButtonRectangle.on('pointerover', () => loadButtonRectangle.setFillStyle(0x023020));
            loadButtonRectangle.on('pointerout', () => loadButtonRectangle.setFillStyle(0x00FF00));
    
            const buttonText = this.add.text(120, y, label, { fontSize: '48px', fontFamily: 'Arial', fill: '#452840', resolution: 4 }).setOrigin(0.5, 0.5);
            const buttonContainer = this.add.container(0, 0, [buttonRectangle, buttonText, loadButtonRectangle, loadButtonText]);
    
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
    
            loadButtonRectangle.on('pointerdown', buttonClickedMethod);
        });
        this.setupDeleteButton(stats);
    }

    setupDeleteButton(stats) {
        const deleteButtonRectangle = this.add.rectangle(520, 130, 100, 50, 0xff0000).setInteractive();
        const deleteButtonText = this.add.text(520, 130, 'Delete', { fontSize: '24px', fontFamily: 'Arial', fill: '#fff', resolution: 4 }).setOrigin(0.5, 0.5);
        const deleteButtonContainer = this.add.container(0, 0, [deleteButtonRectangle, deleteButtonText]);
        deleteButtonRectangle.on('pointerover', () => deleteButtonRectangle.setFillStyle(0x8B0000));
        deleteButtonRectangle.on('pointerout', () => deleteButtonRectangle.setFillStyle(0xff0000));
        if (stats !== null) {
            deleteButtonRectangle.on('pointerdown', async () => {
                await this.gameState.deleteSave();
                this.scene.restart();
            });
        } else {
            deleteButtonRectangle.disableInteractive();
            deleteButtonText.setAlpha(0.5);
        }
    }
    
    async deleteGame1(){
        //handles the functionality of deleting the game from slot 1.
    }

    async deleteGame2(){console.log('Delete Slot 2 button pressed. Dummy button for now.')}
    async deleteGame3(){console.log('Delete Slot 3 button pressed. Dummy button for now.')}

    // Methods for loading the game

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

    async loadGame2(){console.log('Load Slot 2 button pressed. Dummy button for now.')}
    async loadGame3(){console.log('Load Slot 3 button pressed. Dummy button for now.')}

}