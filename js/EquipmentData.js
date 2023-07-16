import things from './Things.js'

export default class EquipmentData extends Phaser.Events.EventEmitter {
    constructor(scene, gameState, player) {
        super();
        this.scene = scene;
        this.gameState = gameState;
        this.player = player;
        this.gameState.setEquipItems([null, null, null, null, null, null, null, null, null]);
        if (this.gameState.getEquipVisibility() === undefined) {
            this.gameState.setEquipVisibility(true);
        } 
    }

    setInventoryData(inventoryData) {
        this.inventoryData = inventoryData;
    }

    equipWeapon(item) {
        let equipItems = this.gameState.getEquipItems();
        equipItems[3] = item;
        this.gameState.setEquipItems(equipItems);
        console.log(`Equips array: ${equipItems[3]}`)
        //increase stats appropriately
        console.log(`Equipped ${item.name}`)
        this.emit('equipmentChanged');
    }

    equipOffhand(item) {
        let equipItems = this.gameState.getEquipItems();
        equipItems[4] = item;
        this.gameState.setEquipItems(equipItems);
        console.log(`Equips array: ${equipItems[4]}`)
        //increase stats appropriately
        console.log(`Equipped ${item.name}`)
        this.emit('equipmentChanged');
    }

    equipHelm(item) {
        let equipItems = this.gameState.getEquipItems();
        equipItems[0] = item;
        this.gameState.setEquipItems(equipItems);
        console.log(`Equips array: ${equipItems[0]}`)
        //increase stats appropriately
        console.log(`Equipped ${item.name}`)
        this.emit('equipmentChanged');
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
    
            console.log(`Item unequipped: ${item.name}`);
    
            equipItems[index] = null;
            this.gameState.setEquipItems(equipItems);
            this.emit('equipmentChanged');
        }
    }
}


/*





    toggleEquipmentVisibility() {this.gameState.setEquipVisibility(!this.gameState.getEquipVisibility())}


    unequipItem(index) {
        let equips = this.gameState.getEquipItems();
        if (equips[index] && equips[index].canEquip === true) {
            let type = equips[index].type; 
            if (equips[index].quantity > 1) {
                equips[index].quantity--;
                this.gameState.setEquipItems(equips);
            } else if (equips[index].quantity === 1) {
                equips[index].quantity--;
            }
    
            switch (type) {
                case 'weapon':
                    this.unequipWeapon(type);
                    break;
                case 'offhand':
                    this.unequipOffhand(type);
                    break;
                case 'helm':
                    this.unequipHelm(type);
                    break;
                default:
                    console.error('Invalid type:', type);
            }
    
            if (equips[index]?.quantity === 0) {
                this.removeEquippedItem(index);
            }
        }
    }

    unequipWeapon(type) {
        if(type === 'weapon'){
            //decrease stats appropriately
            //render new animation set for the hero
        }
    }
    unequipOffhand(type) {
        if(type === 'shield' || type === 'defender'){
            //decrease stats appropriately
            //render new animation set for the hero
        }
    }
    unequipHelm(type) {
        if(type === 'helm'){
            //decrease stats appropriately
            //render new animation set for the hero
        }
    }
*/

