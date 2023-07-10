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
        //this.player = data.player;
        this.gameState = data.gameState;
    }

    create() {
        this.slots = [];
        this.items = [];
        let inventoryData = this.gameState.getInventoryData();
        let isVisible = this.gameState.getInventoryVisible();
    
        for (let i = 0; i < 16; i++) {
            let x = 200 + (i % 4) * 48;
            let y = 200 + Math.floor(i / 4) * 48;
            let slot = this.add.sprite(x, y, 'items', 11);
            slot.setDepth(420).setScale(1.4).setInteractive();
            slot.on('pointerover', () => {slot.setTint(0xffff00); console.log(`Hovering over slot ${i}`)});
            slot.on('pointerout', () => {slot.clearTint()});
            this.slots.push(slot);
    
            if (inventoryData[i]) {
                let item = this.add.sprite(x, y, 'items', inventoryData[i].frame);
                item.setDepth(621).setScale(1.4);
                this.items.push(item);
            }
        }
    
        this.bagbackground = this.add.image(272, 272, 'bag');
        this.bagbackground.setDepth(300).setScale(2.45);
        this.userInput = new UserInput(this);
    
        this.slots.forEach(slot => slot.visible = isVisible);
        this.items.forEach(item => item.visible = isVisible);
        this.bagbackground.visible = isVisible;
    
        this.userInput.cursors.I.on('down', () => {
            isVisible = !isVisible;
            this.slots.forEach(slot => slot.visible = isVisible);
            this.items.forEach(item => item.visible = isVisible);
            this.bagbackground.visible = isVisible;
            this.gameState.setInventoryVisible(isVisible);
        });
    }

    update() {
    }
};