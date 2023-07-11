export default class InventoryData {
    constructor() {
        this.items = [
            null, null, null, null, 
            {name: "sword", frame: 81, quantity: 1}, null, null, null, 
            null, {name: "potion", frame: 144, quantity: 2}, null, null, 
            null, null, null, null
        ];
    }
    
    decrementQuantity(index){
        if (this.items[index] && this.items[index].quantity > 1) {
            this.items[index].quantity--;
        } else if (this.items[index] && this.items[index].quantity === 1) {
            this.removeItem(index);
        }
    }

    removeItem(index){
        this.items[index] = null;
    }
}