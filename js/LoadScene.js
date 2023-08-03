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
        this.loadBackground = this.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'purplebackground');
        this.stats = await this.gameState.getSaveSlotStatistics();
        this.createSlots();
        this.createLoadButtons();
        this.createDeleteButtons();
        this.createBackButton();
        this.input.keyboard.on('keydown-ESC', () => this.returnToPreviousScene());
    }

    returnToPreviousScene(){
        this.scene.stop();
        this.scene.start(this.returnScene);
    }

    createBackButton(){
        const backButtonRectangle = this.add.rectangle(60, 610, 80, 40, 0xcbdbfc).setInteractive();
        this.add.text(60, 610, 'Back', { font: '24px Arial', fill: '#452840', resolution: 2 }).setOrigin(0.5, 0.5);
        backButtonRectangle.on('pointerover', () => backButtonRectangle.setFillStyle(0xa3bffa));
        backButtonRectangle.on('pointerout', () => backButtonRectangle.setFillStyle(0xcbdbfc));
        backButtonRectangle.on('pointerdown', () => this.returnToPreviousScene());
    }

    createSlots() {
        const labels = ['Slot 1', 'Slot 2', 'Slot 3'];
        const yPos = [100, 300, 500];
    
        labels.forEach((label, index) => {
            const y = yPos[index];
            const x = this.game.config.width / 2;
            this.add.rectangle(x, y, 600, 160, 0xcbdbfc)
            this.add.text(x - 200, y, label, { font: '48px Arial', fill: '#452840', resolution: 2 }).setOrigin(0.5, 0.5);
            if (this.stats !== null && index === 0) {
                this.add.text(360, y + 30, `${this.stats.timestamp}`, { font: '24px Arial', fill: '#452840', resolution: 2 }).setOrigin(0.5, 0.5);
                this.add.text(360, y - 30, `Player Level: ${this.stats.level}`, { font: '24px Arial', fill: '#452840', resolution: 2 }).setOrigin(0.5, 0.5);
                this.add.text(360, y, `Location: ${this.stats.currentMap}`, { font: '24px Arial', fill: '#452840', resolution: 2 }).setOrigin(0.5, 0.5);
            } else {
                this.add.text(x, y, 'Empty', { font: '48px Arial', fill: '#452840', resolution: 2 }).setOrigin(0.5, 0.5);
            }
        });
    }

    createLoadButtons() {
        const yPos = [60, 260, 460];
        yPos.forEach((y, index) => {
            const x = this.game.config.width / 2 + 230;
            const loadButtonRectangle = this.add.rectangle(x, y, 100, 40, 0x452840).setInteractive();
            this.add.text(x, y, 'Load', { font: '24px Arial', fill: '#cbdbfc', resolution: 2 }).setOrigin(0.5, 0.5);

            loadButtonRectangle.on('pointerover', () => loadButtonRectangle.setFillStyle(0x000));
            loadButtonRectangle.on('pointerout', () => loadButtonRectangle.setFillStyle(0x452840));
            loadButtonRectangle.on('pointerdown', this[`loadGame${index + 1}`].bind(this));
        });
    }

    createDeleteButtons() {
        const yPos = [130, 330, 530];
        yPos.forEach((y, index) => {
            const x = this.game.config.width / 2 + 230;
            const deleteButtonRectangle = this.add.rectangle(x, y, 100, 40, 0x452840).setInteractive();
            this.add.text(x, y, 'Delete', { font: '24px Arial', fill: '#cbdbfc', resolution: 2 }).setOrigin(0.5, 0.5);
    
            deleteButtonRectangle.on('pointerover', () => deleteButtonRectangle.setFillStyle(0x000));
            deleteButtonRectangle.on('pointerout', () => deleteButtonRectangle.setFillStyle(0x452840));
            deleteButtonRectangle.on('pointerdown', this[`deleteGame${index + 1}`].bind(this));
        });
    }

    async deleteGame1() {
        if (this.stats !== null) {
            await this.gameState.deleteSave();
            this.scene.restart();
        } else {
            console.log('No save data found.')
        }
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

    async deleteGame2(){console.log('Delete Slot 2 button pressed, does nothing for now.')}
    async deleteGame3(){console.log('Delete Slot 3 button pressed, does nothing for now.')}
    async loadGame2(){console.log('Load Slot 2 button pressed, does nothing for now.')}
    async loadGame3(){console.log('Load Slot 3 button pressed, does nothing for now.')}
}