export default class Journal extends Phaser.Scene{

    constructor(){
        super("Journal");
    }

    create(data) {
        this.gameState = data.gameState;
        this.inventoryVisible = data.inventoryVisible;
        this.equipmentVisible = data.equipmentVisible;
        this.journalBackground = this.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'brownbackground').setScale(4, 3);
        this.input.keyboard.on('keydown-J', this.resumeGame, this);
    }

    resumeGame() {
        this.scene.stop();
        let inventoryDisplay = this.scene.get('InventoryDisplay');
        let equipmentDisplay = this.scene.get('EquipmentDisplay');
        this.scene.resume(this.gameState.getCurrentMap());
        this.scene.resume('InventoryDisplay');
        this.scene.resume('EquipmentDisplay');
    
        if (this.inventoryVisible) {inventoryDisplay.toggleVisibility()}
        if (this.equipmentVisible) {equipmentDisplay.toggleVisibility()}
    }

}


/*
    setupQuestButton() {
        this.exitButton = this.add.sprite(382, 82, 'items', 12).setScale(0.65).setDepth(200).setInteractive();
        this.exitButton.on('pointerover', () => {this.exitButton.setTint(0x969696)});
        this.exitButton.on('pointerout', () => {this.exitButton.clearTint()});
        this.exitButton.on('pointerdown', this.toggleVisibility.bind(this));
        this.exitButton.setVisible(this.equipmentData.gameState.getEquipVisibility());
    }

    setupStatsButton() {
        this.exitButton = this.add.sprite(382, 82, 'items', 12).setScale(0.65).setDepth(200).setInteractive();
        this.exitButton.on('pointerover', () => {this.exitButton.setTint(0x969696)});
        this.exitButton.on('pointerout', () => {this.exitButton.clearTint()});
        this.exitButton.on('pointerdown', this.toggleVisibility.bind(this));
        this.exitButton.setVisible(this.equipmentData.gameState.getEquipVisibility());
    }
*/