export default class EquipmentDisplay extends Phaser.Scene {
    constructor(){
        super("EquipmentDisplay");
        this.tileSize = 32;
        this.startX = 69;
        this.startY = 69;
        this.backgroundX = this.startX + 69;
        this.backgroundY = this.startY + 69;
    }

    preload(){
        this.load.spritesheet('items','assets/images/items.png',{frameWidth:32,frameHeight:32});
        this.load.image('equipbackground','assets/images/equipbackground.png');
        //load player image/animation even.
    }

    init(data) {
        this.equipmentData = data.equipment;
    }

    create() {
        this.input.keyboard.on('keydown-I', this.toggleVisibility.bind(this));
        this.background = this.add.sprite(this.backgroundX, this.backgroundY, 'equipbackground').setScale(1.2);
        let slots = [];
    
        let visible = this.equipmentData.gameState.getVisibility();
        this.background.setVisible(visible);
        
        for (let i = 0; i < 16; i++) {
            let item = this.equipmentData.gameState.getItems()[i];
            let x = this.startX + (i % 4) * this.tileDistance;
            let y = this.startY + Math.floor(i / 4) * this.tileDistance;
    
            slots[i] = this.setupSlotSprite(x, y, i);
            slots[i].setVisible(visible);
            this.inventorySprites.push(slots[i]);
            if (item) {
                let itemSprite = this.setupItemSprite(item, i, slots, x, y);
                itemSprite.setVisible(visible);
                this.inventorySprites.push(itemSprite);
            }
        }
    }

    // Helper Methods

    setupSlotSprite(x, y, index) {
        let slotSprite = this.add.sprite(x, y, 'items', 11).setScale(1.4).setInteractive();
        slotSprite.index = index;
        slotSprite.on('pointerover', () => {slotSprite.setTint(0x9e733f); slotSprite.setData('hovered', true);});
        slotSprite.on('pointerout', () => {slotSprite.clearTint(); slotSprite.setData('hovered', false);});
        return slotSprite;
    }

    setupItemSprite(item, i, slots, x, y) {
        let itemSprite = this.add.sprite(x, y, 'items', item.frame).setScale(1.4).setInteractive().setDepth(25);
        if (itemSprite) {
            itemSprite.index = i;
            this.input.setDraggable(itemSprite);
            this.input.setTopOnly(false);
    
            itemSprite.setData({originX: x, originY: y, quantityText: null});
    
            itemSprite.on('dragstart', function (pointer) {this.setTint(0xbfbfbf)});
    
            itemSprite.on('drag', function (pointer, dragX, dragY) {
                this.x = dragX;
                this.y = dragY;
                if (this.getData('quantityText')) {
                    this.getData('quantityText').x = dragX + this.textOffset;
                    this.getData('quantityText').y = dragY + this.textOffset;
                }
            });
    
            itemSprite.on('dragend', (pointer) => {this.handleDragEnd(itemSprite, slots)(pointer)});
            let quantityText = null;
            if(item.quantity > 1){
                quantityText = this.add.text(x + this.textOffset, y + this.textOffset, item.quantity, {fontSize: '16px', fontFamily: 'Arial', fill: '#44ff44', resolution: 4}).setDepth(30);
                quantityText.setVisible(this.equipmentData.gameState.getVisibility());
                itemSprite.setData('quantityText', quantityText);
                this.quantityTexts.push(quantityText);
            }
            this.handleDoubleClick(itemSprite);
            return itemSprite;
        }
    }

    handleDoubleClick(itemSprite) {
        let clickTime = null;

        itemSprite.on('pointerdown', () => {
            if (clickTime !== null) {
                if (this.time.now - clickTime < 300) { 
                    this.equipmentData.useItem(itemSprite.index);
                    const newQuantity = this.equipmentData.gameState.getItems()[itemSprite.index]?.quantity;
                    if (newQuantity > 0) {
                        if (newQuantity > 1) {
                            itemSprite.getData('quantityText').setText(newQuantity);
                        } else {
                            if (itemSprite.getData('quantityText')) {
                                itemSprite.getData('quantityText').destroy();
                                itemSprite.setData('quantityText', null);
                            }
                        }
                    } else {
                        if (itemSprite.getData('quantityText')) {
                            itemSprite.getData('quantityText').destroy();
                        }
                        itemSprite.destroy();
                    }
                    clickTime = null;
                } else {
                    clickTime = this.time.now;
                }
            } else {
                clickTime = this.time.now;
            }
        });
    }

    handleDragEnd(itemSprite, slots) {
        return function(pointer) {
            itemSprite.clearTint();
            let hoveredSlot = slots.find(slotSprite => slotSprite.getData('hovered'));
            if (hoveredSlot && !this.equipmentData.gameState.getItems()[hoveredSlot.index]) {
                // If the hovered slot is empty, move the item there
                let oldIndex = itemSprite.index;
                itemSprite.index = hoveredSlot.index;
                this.equipmentData.moveItem(oldIndex, itemSprite.index);
                // Update positions to reflect the new slot
                itemSprite.setData({ originX: hoveredSlot.x, originY: hoveredSlot.y });
                itemSprite.x = itemSprite.getData('originX');
                itemSprite.y = itemSprite.getData('originY');
                if (itemSprite.getData('quantityText')) {
                    itemSprite.getData('quantityText').x = itemSprite.getData('originX') + this.textOffset;
                    itemSprite.getData('quantityText').y = itemSprite.getData('originY') + this.textOffset;
                }
            } else {
                itemSprite.x = itemSprite.getData('originX');
                itemSprite.y = itemSprite.getData('originY');
                if (itemSprite.getData('quantityText')) {
                    itemSprite.getData('quantityText').x = itemSprite.getData('originX') + this.textOffset;
                    itemSprite.getData('quantityText').y = itemSprite.getData('originY') + this.textOffset;
                }
            }
        }.bind(this);
    }

    toggleVisibility() {
        this.equipmentData.toggleInventoryVisibility();
        let visible = this.equipmentData.gameState.getVisibility();
        this.background.setVisible(visible);
        this.inventorySprites.forEach(sprite => sprite.setVisible(visible));
        this.quantityTexts.forEach(text => text.setVisible(visible));
    }
}