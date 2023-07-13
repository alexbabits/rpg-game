import UserInput from './UserInput.js';

export default class InventoryData {
    constructor(scene, gameState) {
        this.scene = scene;
        this.gameState = gameState;
        this.gameState.setItems([
            null, null, null, {name: "shield", frame: 96, quantity: 1, canEquip: true, canUse: false, stackable: false}, 
            {name: "sword", frame: 81, quantity: 1, canEquip: true, canUse: false, stackable: false}, null, null, null, 
            null, {name: "potion", frame: 144, quantity: 2, canEquip: false, canUse: true, stackable: false}, null, null, 
            null, null, {name: "gold", frame: 202, quantity: 50, canEquip: false, canUse: false, stackable: true}, null
        ]);
        this.gameState.setVisibility(true);

        this.handlePointerOver = this.handlePointerOver.bind(this);
        this.handlePointerOut = this.handlePointerOut.bind(this);
        this.handlePointerDown = this.handlePointerDown.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);

        this.userInput = new UserInput(this.scene, {
            onPointerOver: this.handlePointerOver,
            onPointerOut: this.handlePointerOut,
            onPointerDown: this.handlePointerDown,
            onDrag: this.handleDrag,
            onDragStart: this.handleDragStart,
            onDragEnd: this.handleDragEnd
          });
    }

    handlePointerOver(pointer, gameObject) {

    }

    handlePointerOut(pointer) {

    }

    
    handlePointerDown(pointer, gameObject) {}
    handleDrag(pointer, gameObject, dragX, dragY) {}
    handleDragStart(pointer, gameObject) {}
    handleDragEnd(pointer, gameObject, dropped) {}

    decrementQuantity(index){
        let items = this.gameState.getItems();
        if (items[index] && items[index].quantity > 1) {
            items[index].quantity--;
            this.gameState.setItems(items);
        } else if (items[index] && items[index].quantity === 1) {
            this.removeItem(index);
        }
    }
    
    removeItem(index){
        let items = this.gameState.getItems();
        if(items[index]){
            items[index] = null;
        } 
        this.gameState.setItems(items);     
    }

    incrementQuantity(index){
        let items = this.gameState.getItems();
        if (items[index]){
            items[index].quantity++;
        }
        this.gameState.setItems(items);
    }

    toggleInventoryVisibility() {this.gameState.setVisibility(!this.gameState.getVisibility())}

    // Then the InventoryDisplay file can display or not display the inventory based on the data setting of the visibility.
   
/*

    useItem(){
        // 'canUse' has to be true.
        // All items to be used, should be double clicked.
    }

    //usePotion becomes the child method of useItem. (useManaPotion, useHealthPotion, etc. can all be made simply then.)
    usePotion() {
        let potionIndex = this.gameState.inventoryData.items.findIndex(item => item && item.name === 'potion');
        if (potionIndex !== -1) {
            this.gameState.inventoryData.decrementQuantity(potionIndex);
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