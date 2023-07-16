export default class EquipmentDisplay extends Phaser.Scene {
    constructor(){
        super("EquipmentDisplay");
    }

    preload(){
        this.load.image('equipbackground','assets/images/equipbackground.png');
    }

    init(data) {
        this.equipmentData = data.equipment;
    }

    create() {
        //this.input.keyboard.on('keydown-C', this.toggleVisibility.bind(this));
        this.sprite = this.add.sprite(500, 260, 'hero');
        this.sprite.setDepth(50).setScale(4);
        let animConfig = {key: 'hero_idle', frames: 6, frameRate: 12, repeat: -1};
        this.anims.create(animConfig);
        this.sprite.anims.play('hero_idle');
        this.sprite.anims.msPerFrame = 150;


        this.background = this.add.sprite(500, 240, 'equipbackground').setScale(1.6).setDepth(30);
        let slots = [];
        slots[0] = this.setupSlotSprite(415, 155, 0);
        slots[1] = this.setupSlotSprite(415, 230, 1);
        slots[2] = this.setupSlotSprite(415, 305, 2);
        slots[3] = this.setupSlotSprite(470, 360, 3);
        slots[4] = this.setupSlotSprite(540, 360, 4);
        slots[5] = this.setupSlotSprite(590, 305, 5);
        slots[6] = this.setupSlotSprite(590, 255, 6);
        slots[7] = this.setupSlotSprite(590, 205, 7);
        slots[8] = this.setupSlotSprite(590, 155, 8);
    }

    setupSlotSprite(x, y, index) {
        let slotSprite = this.add.sprite(x, y, 'items', 11).setScale(1.4).setInteractive().setDepth(35);
        slotSprite.index = index;
        slotSprite.on('pointerover', () => {slotSprite.setTint(0x9e733f); slotSprite.setData('hovered', true);});
        slotSprite.on('pointerout', () => {slotSprite.clearTint(); slotSprite.setData('hovered', false);});
        return slotSprite;
    }

}
        /*
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
        */

    // Helper Methods
/*

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
    */
