/*
Preloading Assets: You can load all the essential assets in this scene.
Loading Bar: A loading bar gives visual feedback to the player, showing how much of the game has been loaded.
Transition: Once everything is loaded, you can transition to the StartScreen or directly to the main game scene.
*/


export default class BootScene extends Phaser.Scene {
    constructor() {
      super('BootScene');
    }
    preload(){
        //preload all assets
    }
    create() {
        //create loading bar
        //lets use a blank purple background.
    }

    update() {
        //may need to update loading bar?
    }
}