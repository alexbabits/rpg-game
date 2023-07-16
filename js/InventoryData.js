import things from './Things.js'

export default class InventoryData {
    constructor(scene, gameState, player) {
        this.scene = scene;
        this.gameState = gameState;
        this.player = player;
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
                let itemType = items[index].type; 
                if (items[index].quantity > 1) {
                    items[index].quantity--;
                    this.gameState.setInvItems(items);
                } else if (items[index].quantity === 1) {
                    items[index].quantity--;
                }
    
            switch (itemType) {
                case 'weapon':
                    this.equipWeapon(itemType);
                    break;
                case 'offhand':
                    this.equipOffhand(itemType);
                    break;
                case 'helm':
                    this.equipHelm(itemType);
                    break;
                default:
                    console.error('Invalid item index or type:', index, itemType);
            }
    
            if (items[index]?.quantity === 0) {
                this.removeInvItem(index);
            }
        }
    }

    equipWeapon(type) {
        if(type === 'weapon'){
            //item goes to slot[3] in equips array
            //increase stats appropriately
            console.log(`Equipped weapon.`)
        }
    }
    
    equipOffhand(type) {
        if(type === 'offhand'){
            //item goes to slot[4] in equips array
            //increase stats appropriately
            console.log(`Equipped offhand.`)
        }
    }
    equipHelm(type) {
        if(type === 'helm'){
            //item goes to slot[0] in equips array
            //increase stats appropriately
            console.log(`Equipped helm.`)
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