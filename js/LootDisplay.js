export default class LootDisplay extends Phaser.Scene {
    constructor() {
        super("LootDisplay");
    }

    create(data) {
        this.loot = data.loot;
        this.lootScene = data.scene;
        this.lootBackground = this.add.sprite(this.loot.x, this.loot.y, 'bag').setScale(2.0, 1.5);
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
        this.drawItemSprite(0, this.loot.itemDrop.frame);
        this.setupExitButton();
    }

    handleSingleClick(itemSprite, slotIndex){
        this.lootScene.events.emit('itemLooted', this.loot.itemDrop)
        itemSprite.destroy();
        this.slots[slotIndex].itemSprite = null;
        if (this.slots.every(slot => slot.itemSprite === null)) {
            this.closeDisplay();
            console.log(`Looted ${this.loot.itemDrop.name}`)
        }
    }

    drawItemSprite(slotIndex, frame){
        let slot = this.slots[slotIndex];
        let itemSprite = this.add.sprite(slot.x, slot.y, 'items', frame).setScale(1.2).setInteractive();
        this.input.setTopOnly(false);
        itemSprite.on('pointerdown', () => {this.handleSingleClick(itemSprite, slotIndex)});
        slot.itemSprite = itemSprite;
    }

    setupSlotSprite(x, y, index) {
        let slotSprite = this.add.sprite(x, y, 'items', 11).setScale(1.4).setInteractive();
        slotSprite.index = index;
        slotSprite.on('pointerover', () => {slotSprite.setTint(0x9e733f)});
        slotSprite.on('pointerout', () => {slotSprite.clearTint()});
        return slotSprite;
    }

    setupExitButton() {
        let exitButton = this.add.sprite(this.loot.x - 75, this.loot.y - 60, 'items', 12).setScale(0.65).setDepth(200).setInteractive();
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