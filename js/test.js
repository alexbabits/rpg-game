export default class test extends Phaser.Scene {
    constructor(){
        super("test");
    }
    preload(){
        this.load.spritesheet('items','assets/images/items.png',{frameWidth:32,frameHeight:32});
    }

    create() {
        console.log('hi')
        let x = this.game.config.width / 4;
        let y = this.game.config.height / 4;
        let inventorySlot = this.add.sprite(x, y, 'items', 11);
        inventorySlot.setDepth(500).setScale(1.5);
    }
};

//See if you can do it without them being in a Scene.