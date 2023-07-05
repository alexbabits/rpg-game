class GameState {
    constructor() {
      this.playerState = null;
    }
  
    setPlayerState(state) {
      this.playerState = state;
    }
  
    getPlayerState() {
      return this.playerState;
    }
}


/*

To use this class, you'd instantiate it in your map scenes like any other class:
--> "this.gameState = new GameState(this);"
--> "this.gameState.setState()" and "this.gameState.getState()" to update and retrieve the game state. 
--> Save and load the game by calling "this.gameState.saveGame()" and "this.gameState.loadGame()".

This saves game state to the user's local storage. Local Storage limits are 5-10MB. May need to use IndexedDB or a server-side database or the cloud. 

If your game state contains complex objects like class instances, you may need to handle serialization and deserialization manually, as JSON.stringify/parse do not support this.

*/