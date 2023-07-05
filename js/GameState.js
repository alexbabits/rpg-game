class GameState {
  constructor() {
    this.playerState = null;
    this.playerXP = 0;
    this.playerMaxXP = 0;
    this.playerHP = 0;
    this.playerMaxHP = 0;
    this.playerLevel = 0;
    this.playerTotalXP = 0;
    this.playerWalkSpeed = 0;
    this.playerRunSpeed = 0;
    this.playerMaxMana = 0;
    this.playerMana = 0;
    this.playerMaxStamina = 0;
    this.playerStamina = 0;
    this.playerAttStaminaCost = 0;
    this.playerSpAttStaminaCost = 0;
    this.playerSpAttManaCost = 0;
    this.playerCanRun = false;
    this.playerDamage = 0;
    this.playerSpecialDamage = 0;
    this.playerDirection = '';
  }

  setPlayerState(state) {this.playerState = state}
  getPlayerState() {return this.playerState}

  setPlayerXP(xp) {this.playerXP = xp}
  getPlayerXP() {return this.playerXP}

  setPlayerMaxXP(maxXP) {this.playerMaxXP = maxXP}
  getPlayerMaxXP() {return this.playerMaxXP}

  setPlayerHP(hp) {this.playerHP = hp}
  getPlayerHP() {return this.playerHP}

  setPlayerMaxHP(maxHP) {this.playerMaxHP = maxHP}
  getPlayerMaxHP() {return this.playerMaxHP}

  setPlayerLevel(level) {this.playerLevel = level}
  getPlayerLevel() {return this.playerLevel}

  setPlayerTotalXP(totalXP) {this.playerTotalXP = totalXP}
  getPlayerTotalXP() {return this.playerTotalXP}

  setPlayerWalkSpeed(walkSpeed) {this.playerWalkSpeed = walkSpeed}
  getPlayerWalkSpeed() {return this.playerWalkSpeed}

  setPlayerRunSpeed(runSpeed) {this.playerRunSpeed = runSpeed}
  getPlayerRunSpeed() {return this.playerRunSpeed}

  setPlayerMaxMana(maxMana) {this.playerMaxMana = maxMana}
  getPlayerMaxMana() {return this.playerMaxMana}

  setPlayerMana(mana) {this.playerMana = mana}
  getPlayerMana() {return this.playerMana}

  setPlayerMaxStamina(maxStamina) {this.playerMaxStamina = maxStamina}
  getPlayerMaxStamina() {return this.playerMaxStamina}

  setPlayerStamina(stamina) {this.playerStamina = stamina}
  getPlayerStamina() {return this.playerStamina}

  setPlayerAttStaminaCost(attStaminaCost) {this.playerAttStaminaCost = attStaminaCost}
  getPlayerAttStaminaCost() {return this.playerAttStaminaCost}

  setPlayerSpAttStaminaCost(spAttStaminaCost) {this.playerSpAttStaminaCost = spAttStaminaCost}
  getPlayerSpAttStaminaCost() {return this.playerSpAttStaminaCost}

  setPlayerSpAttManaCost(spAttManaCost) {this.playerSpAttManaCost = spAttManaCost}
  getPlayerSpAttManaCost() {return this.playerSpAttManaCost}

  setPlayerCanRun(canRun) {this.playerCanRun = canRun}
  getPlayerCanRun() {return this.playerCanRun}

  setPlayerDamage(damage) {this.playerDamage = damage}
  getPlayerDamage() {return this.playerDamage}

  setPlayerSpecialDamage(specialDamage) {this.playerSpecialDamage = specialDamage}
  getPlayerSpecialDamage() {return this.playerSpecialDamage}

  setPlayerDirection(direction) {this.playerDirection = direction}
  getPlayerDirection() {return this.playerDirection}

}


/*

To use this class, you'd instantiate it in your map scenes like any other class:
--> "this.gameState = new GameState(this);"
--> "this.gameState.setState()" and "this.gameState.getState()" to update and retrieve the game state. 
--> Save and load the game by calling "this.gameState.saveGame()" and "this.gameState.loadGame()".

This saves game state to the user's local storage. Local Storage limits are 5-10MB. May need to use IndexedDB or a server-side database or the cloud. 

If your game state contains complex objects like class instances, you may need to handle serialization and deserialization manually, as JSON.stringify/parse do not support this.

*/