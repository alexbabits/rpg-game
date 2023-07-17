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
                return equipItems[3] === null;
            case 'offhand':
                return equipItems[4] === null;
            case 'helm':
                return equipItems[0] === null;
            default:
                console.error('Invalid item type:', itemType);
                return false;
        }
    }

    removeEquippedItem(index) {
        let equipItems = this.gameState.getEquipItems();
        if (equipItems[index]) {
            let item = equipItems[index];
            this.inventoryData.addInvItem(item);
            let newDefense = this.player.gameState.getPlayerDefense() - item.defense;
            this.player.gameState.setPlayerDefense(newDefense);
            let newDamage = this.player.gameState.getPlayerDamage() - item.damage;
            this.player.gameState.setPlayerDamage(newDamage);
            
            this.player.gameState.setPlayerSpecialDamage(newDamage * 2.5);
            console.log(`Item unequipped: ${item.name}. Damage: ${this.player.gameState.getPlayerDamage()} Defense: ${this.player.gameState.getPlayerDefense()}`);
            equipItems[index] = null;
            this.gameState.setEquipItems(equipItems);
            this.emit('equipmentChanged');
        }
    }
    
    equipWeapon(item) {
        let equipItems = this.gameState.getEquipItems();
        equipItems[3] = item;
        this.gameState.setEquipItems(equipItems);
        let newDamage = this.player.gameState.getPlayerDamage() + item.damage;
        this.player.gameState.setPlayerDamage(newDamage);
        
        this.player.gameState.setPlayerSpecialDamage(newDamage * 2.5);
        console.log(`Equipped ${item.name}. Damage: ${this.player.gameState.getPlayerDamage()}.`);
        this.emit('equipmentChanged');
    }

    equipOffhand(item) {
        let equipItems = this.gameState.getEquipItems();
        equipItems[4] = item;
        this.gameState.setEquipItems(equipItems);
        let newDefense = this.player.gameState.getPlayerDefense() + item.defense;
        this.player.gameState.setPlayerDefense(newDefense);

        console.log(`Equipped ${item.name}. Defense: ${this.player.gameState.getPlayerDefense()}.`)
        this.emit('equipmentChanged');
    }

    equipHelm(item) {
        let equipItems = this.gameState.getEquipItems();
        equipItems[0] = item;
        this.gameState.setEquipItems(equipItems);
        //increase stats appropriately
        console.log(`Equipped ${item.name}`)
        this.emit('equipmentChanged');
    }

}