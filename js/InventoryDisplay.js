export default class InventoryDisplay extends Phaser.Scene {
    constructor(){
        super("InventoryDisplay");
        this.tileSize = 32;
        this.tileDistance = this.tileSize * 1.5;
        this.startX = 470;
        this.startY = 470;
        this.backgroundX = this.startX + 72;
        this.backgroundY = this.startY + 72;
        this.textOffset = 10;
        this.inventorySprites = [];
        this.quantityTexts = [];
        this.background = null;
    }

    init(data) {
        this.inventoryData = data.inventory;
    }

    create() {
        this.input.keyboard.on('keydown-I', this.toggleVisibility.bind(this));
        this.background = this.add.sprite(this.backgroundX, this.backgroundY, 'brownbackground').setScale(2.45);
        this.setupExitButton();
        this.setupInventoryIcon();
        let slots = [];
    
        let visible = this.inventoryData.gameState.getInvVisibility();
        this.background.setVisible(visible);
        
        for (let i = 0; i < 16; i++) {
            let item = this.inventoryData.gameState.getInvItems()[i];
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
        this.inventoryData.on('addInvItem', this.drawInventory.bind(this));
    }

    // Helper Methods
    setupExitButton() {
        this.exitButton = this.add.sprite(this.startX - 25, this.startY - 25, 'items', 12).setScale(0.65).setDepth(200).setInteractive();
        this.exitButton.on('pointerover', () => {this.exitButton.setTint(0x969696)});
        this.exitButton.on('pointerout', () => {this.exitButton.clearTint()});
        this.exitButton.on('pointerdown', this.toggleVisibility.bind(this));
        let visible = this.inventoryData.gameState.getInvVisibility();
        this.exitButton.setVisible(visible);
    }

    setupInventoryIcon() {
        this.inventoryIcon = this.add.sprite(35, this.startY+132, 'items', 160).setScale(1.5).setDepth(200).setInteractive();
        this.inventoryIcon.on('pointerover', () => {this.inventoryIcon.setTint(0x969696)});
        this.inventoryIcon.on('pointerout', () => {this.inventoryIcon.clearTint()});
        this.inventoryIcon.on('pointerdown', this.toggleVisibility.bind(this));
    }

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
                quantityText = this.add.text(x + this.textOffset, y + this.textOffset, item.quantity, {fontSize: '14px', fontFamily: 'Arial', fill: '#FFFF00', resolution: 2}).setDepth(30);
                quantityText.setVisible(this.inventoryData.gameState.getInvVisibility());
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
                    this.inventoryData.useItem(itemSprite.index);
                    this.inventoryData.equipItem(itemSprite.index);
                    const newQuantity = this.inventoryData.gameState.getInvItems()[itemSprite.index]?.quantity;
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
            if (hoveredSlot && !this.inventoryData.gameState.getInvItems()[hoveredSlot.index]) {
                // If the hovered slot is empty, move the item there
                let oldIndex = itemSprite.index;
                itemSprite.index = hoveredSlot.index;
                this.inventoryData.moveInvItem(oldIndex, itemSprite.index);
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

    drawInventory() {
        // Clear old sprites and texts
        this.inventorySprites.forEach(sprite => sprite.destroy());
        this.quantityTexts.forEach(text => text.destroy());
        this.inventorySprites = [];
        this.quantityTexts = [];

        let slots = [];
    
        for (let i = 0; i < 16; i++) {
            let item = this.inventoryData.gameState.getInvItems()[i];
            let x = this.startX + (i % 4) * this.tileDistance;
            let y = this.startY + Math.floor(i / 4) * this.tileDistance;
    
            slots[i] = this.setupSlotSprite(x, y, i);
            slots[i].setVisible(this.background.visible);
            this.inventorySprites.push(slots[i]);
    
            if (item) {
                let itemSprite = this.setupItemSprite(item, i, slots, x, y);
                itemSprite.setVisible(this.background.visible);
                this.inventorySprites.push(itemSprite);
            }
        }
    }

    toggleVisibility() {
        this.inventoryData.toggleInventoryVisibility();
        let visible = this.inventoryData.gameState.getInvVisibility();
        this.background.setVisible(visible);
        this.exitButton.setVisible(visible);
        this.inventorySprites.forEach(sprite => sprite.setVisible(visible));
        this.quantityTexts.forEach(text => text.setVisible(visible));
    }

}