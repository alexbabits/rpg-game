export default class LootDisplay extends Phaser.Scene {
    constructor() {
        super("LootDisplay");
    }

    create(data) {
        this.loot = data.loot;
        this.scene = data.scene;
        this.lootBackground = this.add.sprite(this.loot.x, this.loot.y, 'bag').setScale(2.0, 1.5);
        this.slots = [];
        let startX = this.loot.x - 50;
        let startY = this.loot.y - 30;
        for (let i = 0; i < 6; i++) {
            let x = startX + (i % 3) * 48;
            let y = startY + Math.floor(i / 3) * 48; 
            let slotSprite = this.setupSlotSprite(x, y, i);
            this.slots.push(slotSprite);
        }
        this.drawItemSprite(0, this.loot.itemDrop.frame);
    }

    handleSingleClick(itemSprite){
        this.scene.events.emit('itemLooted', this.loot.itemDrop)
        itemSprite.destroy();
    }

    drawItemSprite(slotIndex, frame){
        let slot = this.slots[slotIndex];
        let itemSprite = this.add.sprite(slot.x, slot.y, 'items', frame).setScale(1.2).setInteractive();
        this.input.setTopOnly(false);
        itemSprite.on('pointerdown', () => {this.handleSingleClick(itemSprite)});
        slot.itemSprite = itemSprite;
    }

    setupSlotSprite(x, y, index) {
        let slotSprite = this.add.sprite(x, y, 'items', 11).setScale(1.4).setInteractive();
        slotSprite.index = index;
        slotSprite.on('pointerover', () => {slotSprite.setTint(0x9e733f); slotSprite.setData('hovered', true)});
        slotSprite.on('pointerout', () => {slotSprite.clearTint(); slotSprite.setData('hovered', false)});
        return slotSprite;
    }

}


/*

    closeDisplay() {
        // Stop LootDisplay scene
        this.scene.stop('LootDisplay');
        //delete item sprite, background, and slots when item is looted.
    }

*/