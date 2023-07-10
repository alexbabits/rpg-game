export default class InventoryDisplay extends Phaser.Scene {
    constructor(){
        super("InventoryDisplay");
    }

    preload(){
        this.load.spritesheet('items','assets/images/items.png',{frameWidth:32,frameHeight:32});
        this.load.image('bag','assets/images/bagbackground.png');
    }

    init(data) {
        this.player = data.player;
    }

    create() {
        this.slots = [];

        for (let i = 0; i < 16; i++) {
            let x = 200 + (i % 4) * 48;
            let y = 200 + Math.floor(i / 4) * 48;
            let slot = this.add.sprite(x, y, 'items', 11);
            slot.setDepth(420).setScale(1.4);
            this.slots.push(slot);
        }

        this.bagbackground = this.add.image(272, 272, 'bag');
        this.bagbackground.setDepth(300).setScale(2.45);
    }

    update() {
    }
};