export default class EquipmentDisplay extends Phaser.Scene {
    constructor(){
        super("EquipmentDisplay");
        this.equipmentSprites = [];
        this.textOffset = 10;
    }

    preload(){
        this.load.image('equipbackground','assets/images/equipbackground.png');
    }

    init(data) {
        this.equipmentData = data.equipment;
    }

    create() {
        this.input.keyboard.on('keydown-C', this.toggleVisibility.bind(this));
        this.sprite = this.add.sprite(500, 260, 'hero');
        this.sprite.setDepth(50).setScale(4);
        let animConfig = {key: 'hero_idle', frames: 6, frameRate: 12, repeat: -1};
        this.anims.create(animConfig);
        this.sprite.anims.play('hero_idle');
        this.sprite.anims.msPerFrame = 150;
    
        this.background = this.add.sprite(500, 240, 'equipbackground').setScale(1.6).setDepth(30);
        this.setupExitButton();
        this.setupEquipmentIcon();

        this.slots = [];
        this.slots[0] = this.setupSlotSprite(415, 155, 0);
        this.slots[1] = this.setupSlotSprite(415, 230, 1);
        this.slots[2] = this.setupSlotSprite(415, 305, 2);
        this.slots[3] = this.setupSlotSprite(470, 360, 3);
        this.slots[4] = this.setupSlotSprite(540, 360, 4);
        this.slots[5] = this.setupSlotSprite(590, 305, 5);
        this.slots[6] = this.setupSlotSprite(590, 255, 6);
        this.slots[7] = this.setupSlotSprite(590, 205, 7);
        this.slots[8] = this.setupSlotSprite(590, 155, 8);
    
        let equipItems = this.equipmentData.gameState.getEquipItems();
    
        for (let i = 0; i < equipItems.length; i++) {
            let item = equipItems[i];
            if (item) {
                let itemSprite = this.setupItemSprite(item, i, this.slots, this.slots[i].x, this.slots[i].y);
                this.equipmentSprites.push(itemSprite);
            }
        }

        let playerDamage = this.equipmentData.gameState.getPlayerDamage();
        this.damageText = this.add.text(400, 90, `Damage: ${playerDamage}`, {fontSize: '16px', fontFamily: 'Arial', fill: '#000', resolution: 4}).setDepth(100);
        let playerDefense = this.equipmentData.gameState.getPlayerDefense();
        this.defenseText = this.add.text(400, 105, `Defense: ${playerDefense}`, {fontSize: '16px', fontFamily: 'Arial', fill: '#000', resolution: 4}).setDepth(100);
        this.equipmentData.on('equipmentChanged', this.refreshDisplay, this);

        this.sprite.setVisible(this.equipmentData.gameState.getEquipVisibility());
        this.background.setVisible(this.equipmentData.gameState.getEquipVisibility());
        this.slots.forEach(slot => slot.setVisible(this.equipmentData.gameState.getEquipVisibility()));
        this.equipmentSprites.forEach(sprite => sprite.setVisible(this.equipmentData.gameState.getEquipVisibility()));
        this.damageText.setVisible(this.equipmentData.gameState.getEquipVisibility());
        this.defenseText.setVisible(this.equipmentData.gameState.getEquipVisibility());
    }

    setupEquipmentIcon() {
        this.equipmentIcon = this.add.sprite(110, 603, 'items', 55).setScale(2).setDepth(200).setInteractive();
        this.equipmentIcon.on('pointerover', () => {this.equipmentIcon.setTint(0x969696)});
        this.equipmentIcon.on('pointerout', () => {this.equipmentIcon.clearTint()});
        this.equipmentIcon.on('pointerdown', this.toggleVisibility.bind(this));
    }

    setupExitButton() {
        this.exitButton = this.add.sprite(365, 85, 'items', 12).setScale(0.65).setDepth(200).setInteractive();
        this.exitButton.on('pointerover', () => {this.exitButton.setTint(0x969696)});
        this.exitButton.on('pointerout', () => {this.exitButton.clearTint()});
        this.exitButton.on('pointerdown', this.toggleVisibility.bind(this));
        this.exitButton.setVisible(this.equipmentData.gameState.getEquipVisibility());
    }

    setupSlotSprite(x, y, index) {
        let slotSprite = this.add.sprite(x, y, 'items', 11).setScale(1.4).setInteractive().setDepth(35);
        slotSprite.index = index;
        slotSprite.on('pointerover', () => {slotSprite.setTint(0x9e733f); slotSprite.setData('hovered', true);});
        slotSprite.on('pointerout', () => {slotSprite.clearTint(); slotSprite.setData('hovered', false);});
        return slotSprite;
    }

    setupItemSprite(item, i, slots, x, y) {
        let itemSprite = this.add.sprite(x, y, 'items', item.frame).setScale(1.4).setInteractive().setDepth(45);
        if (itemSprite) {
            itemSprite.index = i;
            this.input.setTopOnly(false);
            itemSprite.setData({originX: x, originY: y, quantityText: null});
    
            let quantityText = null;
            if(item.quantity > 1){
                quantityText = this.add.text(x + this.textOffset, y + this.textOffset, item.quantity, {fontSize: '16px', fontFamily: 'Arial', fill: '#44ff44', resolution: 4}).setDepth(40);
                itemSprite.setData('quantityText', quantityText);
            }
    
            itemSprite.on('pointerdown', (pointer) => {
                if (pointer.downTime - pointer.upTime < 300) {
                    this.equipmentData.removeEquippedItem(i);
                    itemSprite.destroy();
                }
            });
    
            return itemSprite;
        }
    }

    refreshDisplay() {
        for (let sprite of this.equipmentSprites) {
            sprite.destroy();
        }
        this.equipmentSprites = [];
        
        let equipItems = this.equipmentData.gameState.getEquipItems();
    
        for (let i = 0; i < equipItems.length; i++) {
            let item = equipItems[i];
            if (item) {
                let itemSprite = this.setupItemSprite(item, i, this.slots, this.slots[i].x, this.slots[i].y);
                this.equipmentSprites.push(itemSprite);
                itemSprite.on('pointerdown', (pointer) => {
                    if (pointer.downTime - pointer.upTime < 300) {
                        this.equipmentData.removeEquippedItem(i);
                        itemSprite.destroy();
                    }
                });
            }
        }
        let playerDamage = this.equipmentData.gameState.getPlayerDamage();
        this.damageText.setText(`Damage: ${playerDamage}`);
        let playerDefense = this.equipmentData.gameState.getPlayerDefense();
        this.defenseText.setText(`Defense: ${playerDefense}`);

        let visible = this.equipmentData.gameState.getEquipVisibility();
        this.slots.forEach(slot => slot.setVisible(visible));
        this.equipmentSprites.forEach(sprite => sprite.setVisible(visible));
        this.damageText.setVisible(visible);
        this.defenseText.setVisible(visible);
    }

    toggleVisibility() {
        this.equipmentData.toggleEquipmentVisibility();
        let visible = this.equipmentData.gameState.getEquipVisibility();
    
        this.sprite.setVisible(visible);
        this.background.setVisible(visible);
        this.exitButton.setVisible(visible);
        this.slots.forEach(slot => slot.setVisible(visible));
        this.equipmentSprites.forEach(sprite => sprite.setVisible(visible));
        this.damageText.setVisible(visible);
        this.defenseText.setVisible(visible);
    }

}