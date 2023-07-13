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
    
        for (let i = 0; i < 16; i++) {
            let x = this.startX + (i % 4) * this.tileDistance;
            let y = this.startY + Math.floor(i / 4) * this.tileDistance;
    
            let slotSprite = this.add.sprite(x, y, 'items', 11).setScale(1.4).setInteractive();;
            slotSprite.index = i;
    
            slotSprite.on('pointerover', () => {slotSprite.setTint(0x9e733f)});
            slotSprite.on('pointerout', () => {slotSprite.clearTint()});
    
            let item = this.inventoryData.gameState.getItems()[i];
            if (item) {
                let itemSprite = this.add.sprite(x, y, 'items', item.frame).setScale(1.4).setInteractive().setDepth(25);
                if (itemSprite) {
                    itemSprite.index = i;
                    this.input.setDraggable(itemSprite);
                    this.input.setTopOnly(false);
    
                    // Remember the original position to reset it on dragend
                    itemSprite.setData({originX: x, originY: y});
                    
                    itemSprite.on('dragstart', function (pointer) {this.setTint(0xbfbfbf)});
    
                    itemSprite.on('drag', function (pointer, dragX, dragY) {
                        this.x = dragX;
                        this.y = dragY;
                    });
    
                    itemSprite.on('dragend', function (pointer) {
                        this.clearTint();
                        this.x = this.getData('originX');
                        this.y = this.getData('originY');
                    });
    
                    let quantityText = null;
                    if(item.quantity > 1){
                        quantityText = this.add.text(x + 10, y + 10, item.quantity, {fontSize: '16px', fontFamily: 'Arial', fill: '#44ff44', resolution: 4}).setDepth(30);
                    }
    
                    if(quantityText){
                        itemSprite.on('drag', function (pointer, dragX, dragY) {
                            quantityText.x = dragX + 10;
                            quantityText.y = dragY + 10;
                        });
    
                        itemSprite.on('dragend', function (pointer) {
                            quantityText.x = this.getData('originX') + 10;
                            quantityText.y = this.getData('originY') + 10;
                        });
                    }
                }
            }
        }
    }
    
    update() {}
}