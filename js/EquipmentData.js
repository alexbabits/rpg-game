export default class EquipmentData extends Phaser.Events.EventEmitter {
    constructor(scene, gameState, player) {
        super();
        this.scene = scene;
        this.gameState = gameState;
        this.player = player;
        this.equipItems = this.gameState.getEquipItems() || [null, null, null, null, null, null, null, null, null, null, null];
        this.gameState.setEquipItems(this.equipItems);
        if (this.gameState.getEquipVisibility() === undefined) {this.gameState.setEquipVisibility(false)}
    }

    toggleEquipmentVisibility() {this.gameState.setEquipVisibility(!this.gameState.getEquipVisibility())}

    setInventoryData(inventoryData) {this.inventoryData = inventoryData}

    isSlotAvailable(itemType) {
        switch (itemType) {
            case 'weapon':
                return this.equipItems[5] === null;
            case 'offhand':
                return this.equipItems[6] === null;
        }
    }

    unequipItem(index, swapIndex = null) {
        if (this.equipItems[index]) {
            let item = this.equipItems[index];
            this.inventoryData.addInvItem(item, 'unequip', swapIndex);
            let newDefense = this.player.gameState.getPlayerDefense() - item.defense;
            let newDamage = this.player.gameState.getPlayerDamage() - item.damage;
            this.player.gameState.setPlayerDefense(newDefense);
            this.player.gameState.setPlayerDamage(newDamage);
            this.player.gameState.setPlayerSpecialDamage(newDamage * 2.5);
            this.equipItems[index] = null;
            this.gameState.setEquipItems(this.equipItems);
            this.emit('equipmentChanged');
            this.emit('message', `Unequipped ${item.name}.`);
        }
    }
    
    equipWeapon(item) {
        this.equipItems[5] = item;
        this.gameState.setEquipItems(this.equipItems);
        let newDamage = this.player.gameState.getPlayerDamage() + item.damage;
        this.player.gameState.setPlayerDamage(newDamage);
        this.player.gameState.setPlayerSpecialDamage(newDamage * 2.5);
        this.emit('equipmentChanged');
        this.emit('message', `Equipped ${item.name}.`);
    }

    equipOffhand(item) {
        this.equipItems[6] = item;
        this.gameState.setEquipItems(this.equipItems);
        let newDefense = this.player.gameState.getPlayerDefense() + item.defense;
        this.player.gameState.setPlayerDefense(newDefense);
        this.emit('equipmentChanged');
        this.emit('message', `Equipped ${item.name}.`);
    }

}