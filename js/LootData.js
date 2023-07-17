export default class LootData {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

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

}



/*
Handle the possibility of having multiple LootDisplay scenes running simultaneously if several monsters die at the same time. Either ensure there is only one loot box showing at a time, in which case you would need to stop any running LootDisplay scenes before starting a new one. Or you could handle it in the way that multiple loot boxes can appear on the screen, depending on your game's requirements.

Also, in the future, you may want to pass in the monster data (or just the loot data) to the LootData constructor so that the loot can be generated based on the monster that was killed.

    --> Also, each loot scene will be unique, as the sprites will vary based on what is dropped.
    --> Invoke the loot display scene when a monster dies. Get the looting image background to display when the monster dies.
    --> Get monsters position at time of death, and thats the local x and y for the loot display
    --> Declare the items that the monster can drop. Start with one item with 100% drop chance. Put it in the display.
    --> When you click the item it goes into your inventory.
    --> If the item is looted, destroy/stop the entire lootingscene, or if player goes more than 100 distance away, it also gets destroyed.

    --> Monsters should house which items they drop? Via the 'Things.js' array. Or should be in LootData file for each monster to reference?
    --> Each monster will end up having an array of drop items. But initially we can just specify one item from the array.
    (So could do just 'things.healthpotion' as the 'drops' constructor property for a monster.)

    --> Monster type has to have some reference link to the items it drops. Bears drop X, Ents drop Y.
*/