export default class LootDisplay extends Phaser.Scene {
    constructor() {
        super("LootDisplay");
    }

    preload() {
        this.load.image('bag','assets/images/bagbackground.png');
    }

    create(data) {
        this.loot = data.loot;
        this.lootBackground = this.add.sprite(200, 300, 'bag').setScale(1.5);
        //slots (6)
        //item sprite
        //delete item sprite, background, and slots when item is looted.
    }

    closeDisplay() {
        // Stop LootDisplay scene
        this.scene.stop('LootDisplay');
    }

}