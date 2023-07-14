export default class InventoryData {
    constructor(scene, gameState, player) {
        this.scene = scene;
        this.gameState = gameState;
        this.player = player;
        this.gameState.setItems([
            {name: "staminapotion", frame: 147, quantity: 3, canEquip: false, canUse: true, stackable: false}, null, null, {name: "shield", frame: 96, quantity: 1, canEquip: true, canUse: false, stackable: false}, 
            {name: "sword", frame: 81, quantity: 1, canEquip: true, canUse: false, stackable: false}, null, null, null, 
            null, {name: "healthpotion", frame: 144, quantity: 2, canEquip: false, canUse: true, stackable: false}, null, null, 
            null, null, {name: "gold", frame: 202, quantity: 50, canEquip: false, canUse: false, stackable: true}, {name: "manapotion", frame: 145, quantity: 6, canEquip: false, canUse: true, stackable: false}
        ]);
        if (this.gameState.getVisibility() === undefined) {
            this.gameState.setVisibility(true);
        }
    }

    toggleInventoryVisibility() {this.gameState.setVisibility(!this.gameState.getVisibility())}

    moveItem(oldIndex, newIndex) {
        const items = this.gameState.getItems();
        const item = items[oldIndex];
        items[oldIndex] = null;
        items[newIndex] = item;
    }

    removeItem(index){
        let items = this.gameState.getItems();
        if(items[index]){
            items[index] = null;
        } 
        this.gameState.setItems(items);     
    }

    useItem(index) {
        let items = this.gameState.getItems();
        if (items[index] && items[index].canUse === true) {
            let itemName = items[index].name; 
            if (items[index].quantity > 1) {
                items[index].quantity--;
                this.gameState.setItems(items);
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
                this.removeItem(index);
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

    incrementQuantity(index){
        let items = this.gameState.getItems();
        if (items[index]){
            items[index].quantity++;
        }
        this.gameState.setItems(items);
    }

}


/*
    equipItem(){
        //remove the item from the inventory data with removeItem method probably.
        //add the item to the equipment with some kind of addItem method from the equipment class?
    }


    addItem(){
        // Adds an item to first available inventory slot if there is space.
        // If the same item already exists, and there is space, either would 'stack' the item and do incrementQuantity, or put in available slot if not 'stackable'.
        // If no space, just returns and console logs 'Inventory is Full.'
    }


*/