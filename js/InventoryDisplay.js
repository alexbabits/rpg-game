import UserInput from './UserInput.js';

export default class InventoryDisplay extends Phaser.Scene {
    constructor(){
        super("InventoryDisplay");
    }

    preload(){
        this.load.spritesheet('items','assets/images/items.png',{frameWidth:32,frameHeight:32});
        this.load.image('bag','assets/images/bagbackground.png');
    }

    init(data) {
        this.gameState = data.gameState;
    }

    create() {
        this.inventory = [];
    
        for (let i = 0; i < 16; i++) {
            let x = 470 + (i % 4) * 48;
            let y = 470 + Math.floor(i / 4) * 48;
            let slot = this.drawSlot(x, y, i);
    
            let itemData = this.gameState.inventoryData.items[i];
            let item = itemData ? this.drawItem(x, y, itemData, i) : null;
            
            this.inventory.push({ slot, item });
        }
    
        this.bagbackground = this.add.image(542, 542, 'bag');
        this.bagbackground.setDepth(300).setScale(2.45);
        this.userInput = new UserInput(this);
    
        this.toggleVisibility();
    
        this.userInput.cursors.I.on('down', () => {
            this.gameState.toggleInventoryVisibility();
            this.toggleVisibility();
        });
    }

    toggleVisibility() {
        let isVisible = this.gameState.getInventoryVisibility();
        this.inventory.forEach(({ slot, item }) => {
            slot.visible = isVisible;
            if (item) {
                item.visible = isVisible;
                if (item.quantityText) {
                    item.quantityText.visible = isVisible;
                }
            }
        });
        this.bagbackground.visible = isVisible;
    }

    drawSlot(x, y, i) {
        let slot = this.add.sprite(x, y, 'items', 11);
        slot.setDepth(420).setScale(1.4).setInteractive();
        slot.on('pointerover', () => {
            slot.setTint(0xffff00); 
            console.log(`Hovering over slot ${i}`);
            this.hoveredSlotIndex = i;
        });
        slot.on('pointerout', () => {
            slot.clearTint();
            this.hoveredSlotIndex = null;
        });
        return slot;
    }
    
    drawItem(x, y, itemData, i) {
        let item = this.add.sprite(x, y, 'items', itemData.frame);
        item.setDepth(621).setScale(1.4);
        if (itemData.quantity >= 2) {
            let quantityText = this.add.text(x+10, y+5, itemData.quantity, { fontSize: '16px', fontFamily: 'Arial', fill: '#000', resolution: 4 });
            quantityText.setDepth(622);
            item.quantityText = quantityText;
        }
    
        item.setInteractive();
        this.input.setDraggable(item);
        this.input.setTopOnly(false);

        item.index = i;

        item.on('dragstart', function (pointer) {
            this.startX = this.x;
            this.startY = this.y;
        });
    
        item.on('drag', function (pointer) {
            this.x = pointer.x;
            this.y = pointer.y;
        });

        item.on('dragend', function (pointer) {
            if (this.scene.hoveredSlotIndex !== null && this.scene.gameState.inventoryData.items[this.scene.hoveredSlotIndex] === null) {
                // If the pointer is over a slot and the slot is empty, move the item to the slot
                this.x = this.scene.inventory[this.scene.hoveredSlotIndex].slot.x;
                this.y = this.scene.inventory[this.scene.hoveredSlotIndex].slot.y;
                // Update the items array
                this.scene.gameState.inventoryData.items[this.index] = null;
                this.scene.gameState.inventoryData.items[this.scene.hoveredSlotIndex] = itemData;
            } else {
                // If the pointer is not over a slot or the slot is not empty, move the item back to its original position
                this.x = this.startX;
                this.y = this.startY;
            }
        });
        return item;
    }
}