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
        slot.on('pointerover', () => this.onPointerOver(slot, i));
        slot.on('pointerout', () => this.onPointerOut(slot));
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
    
        item.on('dragstart', (pointer) => this.onDragStart(item, pointer));
        item.on('drag', (pointer) => this.onDrag(item, pointer));
        item.on('dragend', (pointer) => this.onDragEnd(item, pointer, itemData));
    
        return item;
    }

    onPointerOver(slot, i) {
        slot.setTint(0xffff00); 
        console.log(`Hovering over slot ${i}`);
        this.hoveredSlotIndex = i;
    }
    
    onPointerOut(slot) {
        slot.clearTint();
        this.hoveredSlotIndex = null;
    }

    onDragStart(item, pointer) {
        item.startX = item.x;
        item.startY = item.y;
    }
    
    onDrag(item, pointer) {
        item.x = pointer.x;
        item.y = pointer.y;
        this.updateQuantityTextPosition(item, pointer.x, pointer.y);
    }
    
    onDragEnd(item, pointer, itemData) {
        if (this.hoveredSlotIndex !== null && this.gameState.inventoryData.items[this.hoveredSlotIndex] === null) {
            item.x = this.inventory[this.hoveredSlotIndex].slot.x;
            item.y = this.inventory[this.hoveredSlotIndex].slot.y;
            this.updateQuantityTextPosition(item, item.x, item.y);
    
            this.gameState.inventoryData.items[item.index] = null;
            this.gameState.inventoryData.items[this.hoveredSlotIndex] = itemData;
            item.index = this.hoveredSlotIndex;
        } else {
            item.x = item.startX;
            item.y = item.startY;
            this.updateQuantityTextPosition(item, item.startX, item.startY);
        }
    }

    updateQuantityTextPosition(item, x, y) {
        if (item.quantityText) {
            item.quantityText.x = x + 10; item.quantityText.y = y + 5;
        }
    }
}