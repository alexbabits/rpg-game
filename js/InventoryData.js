export default class InventoryData {
    constructor() {
        this.items = [
            null, null, null, null, 
            {name: "sword", frame: 81, quantity: 1}, null, null, null, 
            null, {name: "potion", frame: 144, quantity: 2}, null, null, 
            null, null, null, null
        ];
    }
    setInventoryData(inventoryData) {this.items = inventoryData}
    getInventoryData() {return this.items}
}