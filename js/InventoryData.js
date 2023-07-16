import things from './Things.js'

export default class InventoryData {
    constructor(scene, gameState, player, equipmentData) {
        this.scene = scene;
        this.gameState = gameState;
        this.player = player;
        this.equipmentData = equipmentData;
        this.gameState.setInvItems([
            things.staminapotion, null, null, things.basicshield, 
            things.basicsword, null, null, null, 
            null, things.healthpotion, things.metalshield, null, 
            null, things.metalsword, things.gold, things.manapotion
        ]);
        if (this.gameState.getInvVisibility() === undefined) {
            this.gameState.setInvVisibility(false);
        }
    }

    toggleInventoryVisibility() {this.gameState.setInvVisibility(!this.gameState.getInvVisibility())}

    moveInvItem(oldIndex, newIndex) {
        const items = this.gameState.getInvItems();
        const item = items[oldIndex];
        items[oldIndex] = null;
        items[newIndex] = item;
    }

    removeInvItem(index){
        let items = this.gameState.getInvItems();
        if(items[index]){
            items[index] = null;
        } 
        this.gameState.setInvItems(items);     
    }

    useItem(index) {
        let items = this.gameState.getInvItems();
        if (items[index] && items[index].canUse === true) {
            let itemName = items[index].name; 
            if (items[index].quantity > 1) {
                items[index].quantity--;
                this.gameState.setInvItems(items);
            } else if (items[index].quantity === 1) {
                items[index].quantity--;
            }
    
            switch (itemName) {
                case 'healthpotion':
                    this.useHealthPotion(itemName);
                    break;
                case 'manapotion':
                    this.useManaPotion(itemName);
                    break;
                case 'staminapotion':
                    this.useStaminaPotion(itemName);
                    break;
                default:
                    console.error('Invalid item name:', itemName);
            }
    
            if (items[index]?.quantity === 0) {
                this.removeInvItem(index);
            }
        }
    }
    
    useHealthPotion(itemName) {
        if(itemName === 'healthpotion'){
            this.player.gameState.setPlayerHP(this.player.gameState.getPlayerHP() + 50);
            console.log(`Used health potion. HP is now ${this.player.gameState.getPlayerHP()}`)
        }
    }
    useManaPotion(itemName) {
        if(itemName === 'manapotion'){
            this.player.gameState.setPlayerMana(this.player.gameState.getPlayerMana() + 10);
            console.log(`Used mana potion. Mana is now ${this.player.gameState.getPlayerMana()}`)
        }
    }
    useStaminaPotion(itemName) {
        if(itemName === 'staminapotion'){
            this.player.gameState.setPlayerStamina(this.player.gameState.getPlayerStamina() + 25);
            console.log(`Used stamina potion. Stamina is now ${this.player.gameState.getPlayerStamina()}`)
        }
    }

    equipItem(index){
        let items = this.gameState.getInvItems();
        if (items[index] && items[index].canEquip === true) {
            let item = items[index];
            
            // Check if slot is available for this item type
            if (!this.equipmentData.isSlotAvailable(item.type)) {
                console.log('Slot is already occupied. Cannot equip item.');
                return;
            }
            
            if (items[index].quantity > 1) {
                items[index].quantity--;
                this.gameState.setInvItems(items);
            } else if (items[index].quantity === 1) {
                items[index].quantity--;
            }
    
            switch (item.type) {
                case 'weapon':
                    this.equipmentData.equipWeapon(item);
                    break;
                case 'offhand':
                    this.equipmentData.equipOffhand(item);
                    break;
                case 'helm':
                    this.equipmentData.equipHelm(item);
                    break;
                default:
                    console.error('Invalid item index or type:', index, item.type);
            }
    
            if (items[index]?.quantity === 0) {
                this.removeInvItem(index);
            }
        }
    }

    /*
    addInvItem(item){
    let invItems = this.gameState.getInvItems();
    invItems.push(item);
    this.gameState.setInvItems(invItems);
    console.log(`Item added to inventory: ${item.name}`);
    }
    */

}


/*

    incrementQuantity(index){
        let items = this.gameState.getInvItems();
        if (items[index]){
            items[index].quantity++;
        }
        this.gameState.setInvItems(items);
    }


    addItem(){
        // Adds an item to first available inventory slot if there is space.
        // If the same item already exists, and there is space, either would 'stack' the item and do incrementQuantity, or put in available slot if not 'stackable'.
        // If no space, just returns and console logs 'Inventory is Full.'
    }


*/