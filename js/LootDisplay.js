export default class LootDisplay extends Phaser.Scene {
    constructor() {
        super("LootDisplay");
    }

    create(data) {
        this.loot = data.loot;
        this.lootScene = data.scene;
        this.lootBackground = this.add.sprite(this.loot.x - 2, this.loot.y - 5, 'brownbackground').setScale(2.0, 1.45);
        this.slots = [];
        let startX = this.loot.x - 50;
        let startY = this.loot.y - 30;
        for (let i = 0; i < 6; i++) {
            let x = startX + (i % 3) * 48;
            let y = startY + Math.floor(i / 3) * 48; 
            let slotSprite = this.setupSlotSprite(x, y, i);
            slotSprite.itemSprite = null;
            this.slots.push(slotSprite);
        }
        this.loot.dropTable.forEach((item, index) => {this.drawItemSprite(index, item)});
        this.setupExitButton();
    }

    handleSingleClick(itemSprite, slotIndex){
        let item = this.loot.dropTable[slotIndex];
        this.lootScene.events.emit('itemLooted', item);
        itemSprite.destroy();
    
        let slot = this.slots[slotIndex];
        if (slot.quantityText) {
            slot.quantityText.destroy();
            slot.quantityText = null;
        }
    
        this.slots[slotIndex].itemSprite = null;
        if (this.slots.every(slot => slot.itemSprite === null)) {
            this.closeDisplay();
            console.log(`Looted ${item.name}`);
        }
    }

    drawItemSprite(slotIndex, item){
        let slot = this.slots[slotIndex];
        let itemSprite = this.add.sprite(slot.x, slot.y, 'items', item.frame).setScale(1.2).setInteractive();
        this.input.setTopOnly(false);
        itemSprite.on('pointerdown', () => {this.handleSingleClick(itemSprite, slotIndex)});
        slot.itemSprite = itemSprite;
        let quantity = item.quantity;
        if (quantity && quantity > 1) {
            let quantityText = this.add.text(slot.x + 10, slot.y + 10, `${quantity}`, {font: '14px Arial', fill: '#FFFF00', resolution: 2});
            slot.quantityText = quantityText;
        }
    }

    setupSlotSprite(x, y, index) {
        let slotSprite = this.add.sprite(x, y, 'items', 11).setScale(1.4).setInteractive();
        slotSprite.index = index;
        slotSprite.on('pointerover', () => {slotSprite.setTint(0x9e733f)});
        slotSprite.on('pointerout', () => {slotSprite.clearTint()});
        return slotSprite;
    }

    setupExitButton() {
        let exitButton = this.add.sprite(this.loot.x - 78, this.loot.y - 66, 'items', 12).setScale(0.65).setDepth(200).setInteractive();
        exitButton.on('pointerover', () => {exitButton.setTint(0x969696)});
        exitButton.on('pointerout', () => {exitButton.clearTint()});
        exitButton.on('pointerdown', () => this.closeDisplay());
        return exitButton;
    }

    closeDisplay() {
        this.lootBackground.destroy();
        this.slots.forEach(slot => {slot.destroy()});
        this.scene.stop();
    }

}