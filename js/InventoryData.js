export default class InventoryData {
    constructor() {
        this.items = [
            null, null, null, {name: "shield", frame: 96, quantity: 1, canEquip: true, canUse: false, stackable: false}, 
            {name: "sword", frame: 81, quantity: 1, canEquip: true, canUse: false, stackable: false}, null, null, null, 
            null, {name: "potion", frame: 144, quantity: 2, canEquip: false, canUse: true, stackable: false}, null, null, 
            null, null, {name: "gold", frame: 202, quantity: 50, canEquip: false, canUse: false, stackable: true}, null
        ];
    }
    
    decrementQuantity(index){
        if (this.items[index] && this.items[index].quantity > 1) {
            this.items[index].quantity--;
        } else if (this.items[index] && this.items[index].quantity === 1) {
            this.items[index] = null;
        }
    }

    incrementQuantity(index){
        if (this.items[index]){
            this.items[index].quantity++;
        }
    }
}