export default class InventoryData {
    constructor(scene, gameState) {
        this.scene = scene;
        this.gameState = gameState;
        this.gameState.setItems([
            null, null, null, {name: "shield", frame: 96, quantity: 1, canEquip: true, canUse: false, stackable: false}, 
            {name: "sword", frame: 81, quantity: 1, canEquip: true, canUse: false, stackable: false}, null, null, null, 
            null, {name: "healthpotion", frame: 144, quantity: 2, canEquip: false, canUse: true, stackable: false}, null, null, 
            null, null, {name: "gold", frame: 202, quantity: 50, canEquip: false, canUse: false, stackable: true}, null
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

    useItem(index){
        let items = this.gameState.getItems();
        if (items[index] && items[index].quantity > 1 && items[index].canUse === true) {
            items[index].quantity--;
            this.gameState.setItems(items);
        } else if (items[index] && items[index].quantity === 1 && items[index].canUse === true) {
            items[index].quantity--;
            this.removeItem(index);
        }
    }

    incrementQuantity(index){
        let items = this.gameState.getItems();
        if (items[index]){
            items[index].quantity++;
        }
        this.gameState.setItems(items);
    }

    removeItem(index){
        let items = this.gameState.getItems();
        if(items[index]){
            items[index] = null;
        } 
        this.gameState.setItems(items);     
    }

/*
    useHealthPotion() {
        if name === 'potion', 
        this.gameState.setPlayerHP(this.gameState.getPlayerHP() + 50);
        console.log(`Player Used Potion. Current HP ${this.gameState.getPlayerHP()}`)
        }
    }

    equipItem(){
        //remove the item from the inventory data with removeItem method probably.
        //add the item to the equipment with some kind of addItem method from the equipment class?
    }


*/

    addItem(){
        // Adds an item to first available inventory slot if there is space.
        // If the same item already exists, and there is space, either would 'stack' the item and do incrementQuantity, or put in available slot if not 'stackable'.
        // If no space, just returns and console logs 'Inventory is Full.'
    }

}