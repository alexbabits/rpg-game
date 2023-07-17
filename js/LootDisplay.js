export default class LootDisplay extends Phaser.Scene {
    constructor() {
        super("LootDisplay");
    }

    preload() {
    }

    create(data) {
        this.loot = data.loot;
        this.lootBackground = this.add.sprite(this.loot.x, this.loot.y, 'bag').setScale(2.0, 1.5);
        this.slots = [];
        let startX = this.loot.x - 50;
        let startY = this.loot.y - 30;
        let tileDistance = 50;
        for (let i = 0; i < 6; i++) {
            let x = startX + (i % 3) * tileDistance;
            let y = startY + Math.floor(i / 3) * tileDistance; 
            let slotSprite = this.setupSlotSprite(x, y, i);
            this.slots.push(slotSprite);
        }


        //delete item sprite, background, and slots when item is looted.
    }

    drawItemSprite(){
        //draws item sprite
    }

    destroyItemSprite(){

    }

    setupSlotSprite(x, y, index) {
        let slotSprite = this.add.sprite(x, y, 'items', 11).setScale(1.4).setInteractive();
        slotSprite.index = index;
        slotSprite.on('pointerover', () => {slotSprite.setTint(0x9e733f); slotSprite.setData('hovered', true);});
        slotSprite.on('pointerout', () => {slotSprite.clearTint(); slotSprite.setData('hovered', false);});
        return slotSprite;
    }

    closeDisplay() {
        // Stop LootDisplay scene
        this.scene.stop('LootDisplay');
    }

}