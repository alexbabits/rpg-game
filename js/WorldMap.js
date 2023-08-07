export default class WorldMap extends Phaser.Scene{

    constructor(){
        super("WorldMap");
    }

    create(data) {
        this.gameState = data.gameState;
        this.inventoryVisible = data.inventoryVisible;
        this.equipmentVisible = data.equipmentVisible;
        this.messageBoxVisible = data.messageBoxVisible;
        this.talentsVisible = data.talentsVisible;
        this.input.keyboard.on('keydown-M', this.closeMap, this);
        this.input.keyboard.on('keydown-ESC', this.closeMap, this);
        this.createBackground();
        this.createExitButton();
        this.createMapSquares();
        this.playerVisibilityTimer = this.time.addEvent({
            delay: 600,
            callback: this.togglePlayerVisibility,
            callbackScope: this,
            loop: true
        });
    }

    createBackground(){
        this.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'brownbackground').setScale(7, 5.5);
        this.add.text(400, 120,'Kingdom of Razion', { font: '24px Arial', fill: '#000', resolution: 2 }).setOrigin(0.5, 0.5);
    }

    //21 = grey, 22 = red, 23 = white, 24 = blue, 25 = brown, 26 = yellow, 27 = black, 28 = purple
    createMapSquares() {
        const colors = [
            21, 21, 21, 22, 22, 23, 23, 23,
            21, 21, 21, 22, 22, 23, 23, 23,
            21, 21, 22, 22, 23, 23, 26, 26,
            24, 24, 24, 22, 23, 26, 26, 26,
            24, 24, 24, 25, 25, 26, 26, 26,
            24, 24, 24, 25, 27, 26, 28, 28,
            25, 25, 25, 25, 27, 28, 28, 28,
            27, 27, 27, 27, 27, 28, 28, 28
        ];
        const names = {21: 'Jakkeen Fields', 22: 'Volmor Gorge', 23: 'Vesp Nimbus', 24: 'Molak Lake', 25: 'Hormick Plateau', 26: 'Zeah\'s Breathe', 27: 'Zion\'s Chasm', 28: 'Razoul\'s Schism'};
        const types = {21: 'Normal', 22: 'Fire', 23: 'Air', 24: 'Water', 25: 'Earth', 26: 'Holy', 27: 'Dark', 28: 'Chaos'};
        const spriteSize = 32
        const scale = 1.5
        const squareSize = spriteSize*scale;
        const startX = 220;
        const startY = 160;

        this.add.text(120, 240, 'Notes', { font: '24px Arial', fill: '#000', resolution: 2 }).setDepth(10).setOrigin(0.5);
        this.add.sprite(120, 330, 'items', 11).setDepth(2).setScale(4, 8).setOrigin(0.5);

        let regionText = this.add.text(120, 280, '', { font: '16px Arial', fill: '#000', resolution: 2 }).setDepth(3).setVisible(false).setOrigin(0.5);
        let nameText = this.add.text(120, 300, '', { font: '16px Arial', fill: '#000', resolution: 2 }).setDepth(3).setVisible(false).setOrigin(0.5);
        let typeText = this.add.text(120, 320, '', { font: '16px Arial', fill: '#000', resolution: 2 }).setDepth(3).setVisible(false).setOrigin(0.5);

        const currentMap = this.gameState.getCurrentMap();
        const currentMapNumber = parseInt(currentMap.substring(3)) - 1; 
        const playerRow = Math.floor(currentMapNumber / 8);
        const playerCol = currentMapNumber % 8;
        const playerX = startX + playerCol * squareSize;
        const playerY = startY + playerRow * squareSize;
        this.add.text(120,140, `Current Region: ${currentMapNumber + 1}`, {font: '16px Arial', fill: '#000', resolution: 2}).setOrigin(0.5,0.5);
        this.playerSprite = this.add.sprite(playerX, playerY, 'items', 40).setDepth(2).setScale(1.25).setOrigin(0.5).setDepth(4);

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const spriteIndex = colors[row * 8 + col];
                const mapNumber = row * 8 + col + 1;
                const type = types[spriteIndex];
                const name = names[spriteIndex];
                const x = startX + col * squareSize;
                const y = startY + row * squareSize;
                const sprite = this.add.sprite(x, y, 'items', spriteIndex).setScale(scale).setInteractive();
    
                sprite.on('pointerover', () => {
                    sprite.setTint(0xDEDEDE);
                    regionText.setText(`Region ${mapNumber}`);
                    typeText.setText(`${type}`);
                    nameText.setText(`${name}`);
                    regionText.setVisible(true);
                    typeText.setVisible(true);
                    nameText.setVisible(true);
                });
    
                sprite.on('pointerout', () => {
                    sprite.clearTint();
                    regionText.setVisible(false);
                    typeText.setVisible(false);
                    nameText.setVisible(false);
                });
            }
        }
    }

    togglePlayerVisibility() {
        this.playerSprite.setVisible(!this.playerSprite.visible);
    }
    

    createExitButton() {
        let exitButton = this.add.sprite(40, 100, 'items', 12).setScale(0.65).setDepth(200).setInteractive();
        exitButton.on('pointerover', () => {exitButton.setTint(0x969696)}); 
        exitButton.on('pointerout', () => {exitButton.clearTint()});
        exitButton.on('pointerdown', () => this.closeMap());
    }

    closeMap() {
        this.scene.stop();
        this.playerVisibilityTimer.destroy();
        let inventoryDisplay = this.scene.get('InventoryDisplay');
        let equipmentDisplay = this.scene.get('EquipmentDisplay');
        let messageBox = this.scene.get('MessageBox');
        let talents = this.scene.get('Talents');
        this.scene.resume(this.gameState.getCurrentMap());
        this.scene.resume('InventoryDisplay');
        this.scene.resume('EquipmentDisplay');
        this.scene.resume('MessageBox');
        this.scene.resume('Talents');
    
        if (this.inventoryVisible) {inventoryDisplay.toggleVisibility()}
        if (this.equipmentVisible) {equipmentDisplay.toggleVisibility()}
        if (this.messageBoxVisible) {messageBox.toggleVisibility()}
        if (this.talentsVisible) {talents.toggleVisibility()}
    }

}