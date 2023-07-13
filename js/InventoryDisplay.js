
export default class InventoryDisplay extends Phaser.Scene {
    constructor(){
        super("InventoryDisplay");
        this.tileSize = 32;
        this.tileDistance = this.tileSize * 1.5;
        this.rows = 4;
        this.slots = 16;
        this.startX = 470;
        this.startY = 470;
        this.backgroundX = this.startX + 72;
        this.backgroundY = this.startY + 72;
        this.backgroundScale = 2.45;
    }

    preload(){
        this.load.spritesheet('items','assets/images/items.png',{frameWidth:32,frameHeight:32});
        this.load.image('bag','assets/images/bagbackground.png');
    }

    init(data) {
        this.inventoryData = data.inventory;
    }

    create() {

    }

    drawInventory(){
        //draws the slots and items and text
    }
    
    update() {

    }

    updateInventory(){
        //updates the items/text and maybe the slots too.
    }

}