import things from './Things.js'

export default class InventoryData {
    constructor(scene, gameState, player) {
        this.scene = scene;
        this.gameState = gameState;
        this.player = player;
        this.gameState.setInvItems([
            things.staminapotion, null, null, things.shield, 
            things.sword, null, null, null, 
            null, things.healthpotion, null, null, 
            null, null, things.gold, things.manapotion
        ]);
        if (this.gameState.getInvVisibility() === undefined) {
            this.gameState.setInvVisibility(true);
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
            console.log(`Used health potion. Gained 50 HP. HP is now ${this.player.gameState.getPlayerHP()}`)
        }
    }
    useManaPotion(itemName) {
        if(itemName === 'manapotion'){
            this.player.gameState.setPlayerMana(this.player.gameState.getPlayerMana() + 10);
            console.log(`Used mana potion. Gained 10 Mana. Mana is now ${this.player.gameState.getPlayerMana()}`)
        }
    }
    useStaminaPotion(itemName) {
        if(itemName === 'staminapotion'){
            this.player.gameState.setPlayerStamina(this.player.gameState.getPlayerStamina() + 25);
            console.log(`Used stamina potion. Gained 25 Stamina. Stamina is now ${this.player.gameState.getPlayerStamina()}`)
        }
    }

    equipItem(type){
        let items = this.gameState.getInvItems();
        if (items[index] && items[index].canEquip === true) {
                items[index].quantity--;
                this.gameState.setInvItems(items);
    
            switch (type) {
                case 'weapon':
                    this.equipWeapon(type);
                    break;
                case 'shield':
                    this.equipShield(type);
                    break;
                case 'helm':
                    this.equipHelm(type);
                    break;
                default:
                    console.error('Invalid item type:', type);
            }
    
            if (items[index]?.quantity === 0) {
                this.removeInvItem(index);
                //add the item to the equipment with some kind of 'addItem' method called here, from the EquipmentData.js?
            }
        }
    }

    equipWeapon(type) {
        if(type === 'weapon'){
            //increase stats appropriately
            //render new animation set for the hero
        }
    }
    equipShield(type) {
        if(type === 'shield'){
            //increase stats appropriately
            //render new animation set for the hero
        }
    }
    equipHelm(type) {
        if(type === 'helm'){
            //increase stats appropriately
            //render new animation set for the hero
        }
    }

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