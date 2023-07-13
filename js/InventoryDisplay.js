export default class InventoryDisplay extends Phaser.Scene {
    constructor(){
        super("InventoryDisplay");
        this.tileSize = 32;
        this.tileDistance = this.tileSize * 1.5;
        this.startX = 470;
        this.startY = 470;
        this.backgroundX = this.startX + 72;
        this.backgroundY = this.startY + 72;
    }

    preload(){
        this.load.spritesheet('items','assets/images/items.png',{frameWidth:32,frameHeight:32});
        this.load.image('bag','assets/images/bagbackground.png');
    }

    init(data) {
        this.inventoryData = data.inventory;
    }

    create() {
        this.add.sprite(this.backgroundX, this.backgroundY, 'bag').setScale(2.45);
        let slots = [];
    
        for (let i = 0; i < 16; i++) {
            let x = this.startX + (i % 4) * this.tileDistance;
            let y = this.startY + Math.floor(i / 4) * this.tileDistance;
    
            let slotSprite = this.add.sprite(x, y, 'items', 11).setScale(1.4).setInteractive();
            slotSprite.index = i;
            slots[i] = slotSprite;
    
            slotSprite.on('pointerover', () => {slotSprite.setTint(0x9e733f); slotSprite.setData('hovered', true);});
            slotSprite.on('pointerout', () => {slotSprite.clearTint(); slotSprite.setData('hovered', false);});
    
            let item = this.inventoryData.gameState.getItems()[i];
            if (item) {
                let itemSprite = this.add.sprite(x, y, 'items', item.frame).setScale(1.4).setInteractive().setDepth(25);
                if (itemSprite) {
                    itemSprite.index = i;
                    this.input.setDraggable(itemSprite);
                    this.input.setTopOnly(false);
    
                    itemSprite.setData({originX: x, originY: y});
    
                    itemSprite.on('dragstart', function (pointer) {this.setTint(0xbfbfbf)});
    
                    itemSprite.on('drag', function (pointer, dragX, dragY) {
                        this.x = dragX;
                        this.y = dragY;
                    });
    
                    itemSprite.on('dragend', function(pointer) {
                        itemSprite.clearTint();
                        let hoveredSlot = slots.find(slotSprite => slotSprite.getData('hovered'));
                        if (hoveredSlot && !this.inventoryData.gameState.getItems()[hoveredSlot.index]) {
                            // If the hovered slot is empty, move the item there
                            let oldIndex = itemSprite.index;
                            itemSprite.index = hoveredSlot.index;
                            this.inventoryData.moveItem(oldIndex, itemSprite.index);
                            // Update positions to reflect the new slot
                            itemSprite.setData({ originX: hoveredSlot.x, originY: hoveredSlot.y });
                            itemSprite.x = itemSprite.getData('originX');
                            itemSprite.y = itemSprite.getData('originY');
                            if (quantityText) {
                                quantityText.x = itemSprite.getData('originX') + 10;
                                quantityText.y = itemSprite.getData('originY') + 10;
                            }
                        } else {
                            // If the hovered slot is not empty or if there's no hovered slot, reset the item to its original slot
                            itemSprite.x = itemSprite.getData('originX');
                            itemSprite.y = itemSprite.getData('originY');
                            if (quantityText) {
                                quantityText.x = itemSprite.getData('originX') + 10;
                                quantityText.y = itemSprite.getData('originY') + 10;
                            }
                        }
                    }.bind(this));
    
                    let quantityText = null;
                    if(item.quantity > 1){
                        quantityText = this.add.text(x + 10, y + 10, item.quantity, {fontSize: '16px', fontFamily: 'Arial', fill: '#44ff44', resolution: 4}).setDepth(30);
                    }
    
                    if(quantityText){
                        itemSprite.on('drag', function (pointer, dragX, dragY) {
                            quantityText.x = dragX + 10;
                            quantityText.y = dragY + 10;
                        });
    
                        itemSprite.on('dragend', (pointer) => {
                            let hoveredSlot = slots.find(slot => slot.getData('hovered'));
                        
                            if (hoveredSlot && this.inventoryData.gameState.getItems()[hoveredSlot.index] === null) {
                                quantityText.x = hoveredSlot.x + 10;
                                quantityText.y = hoveredSlot.y + 10;
                            } else {
                                quantityText.x = itemSprite.getData('originX') + 10;
                                quantityText.y = itemSprite.getData('originY') + 10;
                            }
                        });
                    }
                }
            }
        }
    }
    
    update() {}
}