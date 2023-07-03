export default class GameState {
    constructor(scene) {
        this.scene = scene;
        
        // Initialize with default state
        this.state = {
            player: {
                health: 100,
                position: {x: 0, y: 0},
                inventory: []
            },
            gameProgress: {
                levelsCompleted: 0,
                bossesDefeated: 0,
                questsCompleted: 0,
            }
            // any other state you need to track...
        }
    }

    setState(newState) {
        this.state = {...this.state, ...newState};
    }

    getState() {
        return this.state;
    }

    saveGame() {
        // The simplest way to save game state is to convert the state object to JSON and save it locally.
        // You can also send this data to a server if you want to enable cloud saves.
        localStorage.setItem('gameState', JSON.stringify(this.state));
    }

    loadGame() {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
            this.state = JSON.parse(savedState);
            // After setting state, you'd also want to update your game scene to reflect the loaded state.
            // This might involve moving the player to a saved position, updating their health and inventory, etc.
        }
    }
}



/* 
To use this class, you'd instantiate it in your main game scene:

this.gameState = new GameState(this);

`this.gameState.setState()` and `this.gameState.getState()` to update and retrieve the game state. 
To save and load the game, you'd call `this.gameState.saveGame()` and `this.gameState.loadGame()`.

This saves game state to the user's local storage. Local Storage limits are 5-10MB. May need to use IndexedDB or a server-side database or the cloud. 

Also, remember that if your game state contains complex objects like class instances, you may need to handle serialization and deserialization manually, as JSON.stringify/parse do not support this.

*/