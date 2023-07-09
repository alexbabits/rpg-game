import Items from './Items.js';

export default class Inventory {

    static preload(scene){
        scene.load.spritesheet('items','assets/images/items.png',{frameWidth:32,frameHeight:32});
        scene.load.image('bag','assets/images/bagbackground.png');
    }

    constructor(){
        this.inventoryData = {/*each slot and what is in each slot?*/}
        this.inventoryVisible = true;
    };

    drawInventorySlots(scene){
        let slotSize = 32;
        let slotsPerRow = 4; 
        let slotsPerColumn = 4; 
        let slotSpacing = 5;
        let startX = 420;
        let startY = 420;
        let bagBackground = scene.add.image(475, 475, 'bag')
        bagBackground.setDepth(420).setScale(1.9125).setScrollFactor(0,0)

        this.slotSprites = [];

        for(let i = 0; i < slotsPerRow; i++){
            this.slotSprites[i] = [];
            for(let j = 0; j < slotsPerColumn; j++){
                let x = startX + i * (slotSize + slotSpacing);
                let y = startY + j * (slotSize + slotSpacing);

                let slotSprite = scene.add.sprite(x, y, "items", 11);
                slotSprite.setDepth(777).setScale(1).setScrollFactor(0,0).setInteractive()
                this.slotSprites[i][j] = slotSprite;
            }
        }
    };

    
    addItem(/*itemName or frame, quantity, slotNumber*/){
        //adds an item and it's sprite to the first available inventory slot. Also considers the quantity added. If it's adding another of the same item, add it to the same slot, don't redraw the sprite, and increment a counter text which displays the quantity.
        //If all slots are full such that the item cannot be added, the item is not added. return.
        //Should update the contents array/object in some way.
    };
// If my logic is correct, drawing should only happen once, but then we can then hide or show the inventory as many times as we want?
    drawInventoryItems(/*itemName or frame*/){
        // Draws inventory items (And their associated quantity text) in whichever slots they are in.
        // The frames/names will be different for each different item we add.
        // If my logic is correct, drawing should only happen once, but then we can then hide or show the inventory as many times as we want?
    };



    removeItem(/*itemName or frame, quantity, slotNumber*/){
        //Removes a specified item. Also considers the quantity removed.
        //Should update the contents array/object in some way.
    };

    moveItem() {
        //Handles logic for actually dragging the item sprite around. 
        //Makes it so if the drag stops, the item 'snaps' back to the slot it was in.
        //Move an item from Slot A to Slot B. Also handles if an item is already in that slot, and things like that.
    };

    hideInventory() {
        //hides the inventory slots and their items and the items quantity text. 
    };

    showInventory() {
        //shows the inventory slots and their items and the items quantity text. Perhaps changes a boolean flag like 'inventoryVisible' to true.
    };

    //Perhaps these getters and setters are best placed in our GameState, and thensimply called within loadInventoryState and saveInventoryState?
    getInventoryData(){
        // Gets all of the current inventory data/contents. (For each slot number, it looks to see if theres an item in it, and grabs the item's frame (and/or itemName), it's quantity, and which slot it is in.). Used in saveInventoryState perhaps?
        // Could return this.contents
    };
    setInventoryData(){
        // Sets all of the current inventory data. Used in loadInventoryState perhaps?
        // Could set this.contents
    };

    destroyInventory(){
        //Completely destroys the inventory, it's sprites, and it's data. I suppose invoked during scene transitions? After the inventory has been saved to the gamestate, it makes sure everything is clear, so when a new scene appears, the loadInventoryState can be invoked with no issues?
    };
}

/* Notes 

Which methods should be in Inventory.js and which should be in GameState: Keep methods related to the functionality of the inventory (like adding and removing items, showing and hiding the inventory, etc.) in the Inventory class. Methods related to saving and loading the inventory state (like saveInventoryState and loadInventoryState) should be in the GameState class, since they're more about the overall state of the game than the specific functionality of the inventory.


The underlying data of the inventory (which items are in which slots, and their quantities) is the most important part. This is the "state" of the inventory, and it's what you'll be saving and loading when you transition between scenes.

The visual representation of the inventory (the slots, the item sprites, the quantity text, etc.) is derived from this underlying data. When you load a new scene, you'll load the saved inventory data, and then use this data to draw the inventory on the screen. This could involve creating a sprite for each item in the inventory, positioning it in the correct slot, and displaying the correct quantity.

Process:

1. Save the inventory data: When the player leaves a scene, you'll call saveInventoryState to save the current state of the inventory. This will involve getting the current inventory data (using getInventoryData) and storing it in the GameState.
2. Destroy the inventory: You'll then call destroyInventory to clear the current inventory. This will involve clearing the underlying data (setting this.contents or this.inventoryData to an empty array or object) and also removing any visual elements (the slots, item sprites, quantity text, etc.).
3. Load the new scene: You'll load the new scene.
4. Load the inventory data: You'll call loadInventoryState (Probably within the create method of the parent 'Map' class) to load the saved inventory data into the new scene. This will involve setting the inventory data (using setInventoryData) to the saved data from the GameState.
5. Draw the inventory: You'll call drawInventorySlots to draw the inventory on the screen. This will involve creating a sprite for each item in the inventory, positioning it in the correct slot, and displaying the correct quantity.


*/



/*
    //Bonus/Extra Future stuff:

    tintSelectedSlot() {
        //tints whichever inventory slot the mouse hovers over. Clears the tint when the mouse moves away.
    };

    rightClickDestroy(){
        //If the player right clicks, a small hover screen can come up with the option to remove the item.
    };

    hoverOverStats(){
        // If hovered over an item, displays its name and some text about the item in a small screen.
    };
*/
