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
            slotSprite.on('pointerover', () => {
                console.log('Hovering over slot:', slotSprite.index);
            });

            let item = this.inventoryData.gameState.getItems()[i];
            if (item) {
                let itemSprite = this.add.sprite(x, y, 'items', item.frame).setScale(1.4);
                if(item.quantity > 1){
                    this.add.text(x + 10, y + 10, item.quantity, {fontSize: '16px', fontFamily: 'Arial', fill: '#1ef7f0', resolution: 4});
                }
            }
        }
    }
    
    update() {}
}