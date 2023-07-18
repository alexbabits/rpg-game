export default class LootData {
    constructor(x, y, itemDrop) {
        this.x = x;
        this.y = y;
        this.itemDrop = itemDrop;
    }

}




/*
Handle the possibility of having multiple LootDisplay scenes running simultaneously if several monsters die at the same time. 
--> Either ensure there is only one loot box showing at a time, in which case you would need to stop any running LootDisplay scenes before starting a new one. 
--> Or you could handle it in the way that multiple loot boxes can appear on the screen, depending on your game's requirements.

    --> When you click the item it goes into your inventory.
    --> If the item is looted, destroy/stop the entire lootingscene, or if you click 'exit' the scene gets destroyed.

    --> Monsters should house which items they drop? Via the 'Things.js' array. Or should be in LootData file for each monster to reference?



        addLootItem(){
        //when monster dies, it references the array of items it can drop, or the single item, and add it to our small 6 slot array.
        //then draw the item sprites in the LootDisplay.
        //emitter here for the Display to use?
    }


    removeLootItem(){
        //Will be when the item is single clicked, it gets put in invy and destroyed in loot display.
        //So we'll need a 'handleSingleClick' method which goes back to the create method eventaully in LootDisplay.
    }

    // Other methods here if needed in the future



*/