import things from './Things.js'

export default class EquipmentData extends Phaser.Events.EventEmitter {
    constructor(scene, gameState, player) {
        super();
        this.scene = scene;
        this.gameState = gameState;
        this.player = player;
        this.gameState.setEquipItems([null, null, null, null, null, null, null, null, null]);
        if (this.gameState.getEquipVisibility() === undefined) {
            this.gameState.setEquipVisibility(false);
        } 
    }

    toggleEquipmentVisibility() {this.gameState.setEquipVisibility(!this.gameState.getEquipVisibility())}

    setInventoryData(inventoryData) {
        this.inventoryData = inventoryData;
    }

    isSlotAvailable(itemType) {
        let equipItems = this.gameState.getEquipItems();
        switch (itemType) {
            case 'weapon':
                return equipItems[5] === null;
            case 'offhand':
                return equipItems[6] === null;
            default:
                console.error('Invalid item type:', itemType);
                return false;
        }
    }

    removeEquippedItem(index) {
        let equipItems = this.gameState.getEquipItems();
        if (equipItems[index]) {
            let item = equipItems[index];
            this.inventoryData.addInvItem(item, 'unequip');
            let newDefense = this.player.gameState.getPlayerDefense() - item.defense;
            this.player.gameState.setPlayerDefense(newDefense);
            let newDamage = this.player.gameState.getPlayerDamage() - item.damage;
            this.player.gameState.setPlayerDamage(newDamage);
            
            this.player.gameState.setPlayerSpecialDamage(newDamage * 2.5);
            console.log(`Item unequipped: ${item.name}. Damage: ${this.player.gameState.getPlayerDamage()} Defense: ${this.player.gameState.getPlayerDefense()}`);
            equipItems[index] = null;
            this.gameState.setEquipItems(equipItems);
            this.emit('equipmentChanged');
            this.emit('message', `Unequipped ${item.name}.`);
        }
    }
    
    equipWeapon(item) {
        let equipItems = this.gameState.getEquipItems();
        equipItems[5] = item;
        this.gameState.setEquipItems(equipItems);
        let newDamage = this.player.gameState.getPlayerDamage() + item.damage;
        this.player.gameState.setPlayerDamage(newDamage);
        
        this.player.gameState.setPlayerSpecialDamage(newDamage * 2.5);
        console.log(`Equipped ${item.name}. Damage: ${this.player.gameState.getPlayerDamage()}.`);
        this.emit('equipmentChanged');
        this.emit('message', `Equipped ${item.name}.`);
    }

    equipOffhand(item) {
        let equipItems = this.gameState.getEquipItems();
        equipItems[6] = item;
        this.gameState.setEquipItems(equipItems);
        let newDefense = this.player.gameState.getPlayerDefense() + item.defense;
        this.player.gameState.setPlayerDefense(newDefense);

        console.log(`Equipped ${item.name}. Defense: ${this.player.gameState.getPlayerDefense()}.`)
        this.emit('equipmentChanged');
        this.emit('message', `Equipped ${item.name}.`);
    }

}