export default class GameState {
  constructor() {
    this.playerState = null;
    this.inventoryState = null;
    this.equipmentState = null;
  }

  setEquipItems(equips) {this.equips = equips}
  getEquipItems() {return this.equips}

  setEquipVisibility(equipmentVisible) {this.equipmentVisible = equipmentVisible}
  getEquipVisibility() {return this.equipmentVisible}

  saveEquipmentState(equipment) {
    this.equipmentState = {
      equips: equipment.gameState.getEquipItems(),
      visibility: equipment.gameState.getEquipVisibility()
    }
  }

  loadEquipmentState(equipment) {
    if (this.equipmentState) {
      equipment.gameState.setEquipItems(this.equipmentState.equips);
      equipment.gameState.setEquipVisibility(this.equipmentState.visibility);
    }
  }

  setInvItems(items) {this.items = items}
  getInvItems() {return this.items}

  setInvVisibility(inventoryVisible) {this.inventoryVisible = inventoryVisible}
  getInvVisibility() {return this.inventoryVisible}

  saveInventoryState(inventory) {
    this.inventoryState = {
      items: inventory.gameState.getInvItems(),
      visibility: inventory.gameState.getInvVisibility()
    }
  }

  loadInventoryState(inventory) {
    if (this.inventoryState) {
      inventory.gameState.setInvItems(this.inventoryState.items);
      inventory.gameState.setInvVisibility(this.inventoryState.visibility);
    }
  }

  savePlayerState(player) {
    this.playerState = {
      xp: player.gameState.getPlayerXP(),
      maxXP: player.gameState.getPlayerMaxXP(),
      hp: player.gameState.getPlayerHP(),
      maxHP: player.gameState.getPlayerMaxHP(),
      level: player.gameState.getPlayerLevel(),
      totalXP: player.gameState.getPlayerTotalXP(),
      walkSpeed: player.gameState.getPlayerWalkSpeed(),
      runSpeed: player.gameState.getPlayerRunSpeed(),
      maxMana: player.gameState.getPlayerMaxMana(),
      mana: player.gameState.getPlayerMana(),
      maxStamina: player.gameState.getPlayerMaxStamina(),
      stamina: player.gameState.getPlayerStamina(),
      attStaminaCost: player.gameState.getPlayerAttStaminaCost(),
      spAttStaminaCost: player.gameState.getPlayerSpAttStaminaCost(),
      spAttManaCost: player.gameState.getPlayerSpAttManaCost(),
      canRun: player.gameState.getPlayerCanRun(),
      damage: player.gameState.getPlayerDamage(),
      defense: player.gameState.getPlayerDefense(),
      specialDamage: player.gameState.getPlayerSpecialDamage(),
      direction: player.gameState.getPlayerDirection(),
    };
    
    this.playerPosition = {
      x: player.sprite.x,
      y: player.sprite.y
    };
  }

  loadPlayerState(player) {
    if (this.playerState) {
      player.gameState.setPlayerXP(this.playerState.xp);
      player.gameState.setPlayerMaxXP(this.playerState.maxXP);
      player.gameState.setPlayerHP(this.playerState.hp);
      player.gameState.setPlayerMaxHP(this.playerState.maxHP);
      player.gameState.setPlayerLevel(this.playerState.level);
      player.gameState.setPlayerTotalXP(this.playerState.totalXP);
      player.gameState.setPlayerWalkSpeed(this.playerState.walkSpeed);
      player.gameState.setPlayerRunSpeed(this.playerState.runSpeed);
      player.gameState.setPlayerMaxMana(this.playerState.maxMana);
      player.gameState.setPlayerMana(this.playerState.mana);
      player.gameState.setPlayerMaxStamina(this.playerState.maxStamina);
      player.gameState.setPlayerStamina(this.playerState.stamina);
      player.gameState.setPlayerAttStaminaCost(this.playerState.attStaminaCost);
      player.gameState.setPlayerSpAttStaminaCost(this.playerState.spAttStaminaCost);
      player.gameState.setPlayerSpAttManaCost(this.playerState.spAttManaCost);
      player.gameState.setPlayerCanRun(this.playerState.canRun);
      player.gameState.setPlayerDamage(this.playerState.damage);
      player.gameState.setPlayerDefense(this.playerState.defense);
      player.gameState.setPlayerSpecialDamage(this.playerState.specialDamage);
      player.gameState.setPlayerDirection(this.playerState.direction);
    };

    if (this.playerPosition) {
      player.sprite.x = this.playerPosition.x;
      player.sprite.y = this.playerPosition.y;
    };
  }

  setPlayerXP(xp) {this.playerXP = xp}
  getPlayerXP() {return this.playerXP}

  setPlayerMaxXP(maxXP) {this.playerMaxXP = maxXP}
  getPlayerMaxXP() {return this.playerMaxXP}

  setPlayerHP(hp) {this.playerHP = Math.max(0, Math.min(hp, this.playerMaxHP));}
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

  setPlayerMana(mana) {this.playerMana = Math.max(0, Math.min(mana, this.playerMaxMana));}
  getPlayerMana() {return this.playerMana}

  setPlayerMaxStamina(maxStamina) {this.playerMaxStamina = maxStamina}
  getPlayerMaxStamina() {return this.playerMaxStamina}

  setPlayerStamina(stamina) {this.playerStamina = Math.max(0, Math.min(stamina, this.playerMaxStamina));}
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

  setPlayerDefense(defense) {this.playerDefense = defense}
  getPlayerDefense() {return this.playerDefense}

  setPlayerDirection(direction) {this.playerDirection = direction}
  getPlayerDirection() {return this.playerDirection}

}


/*

Saving the game state to user's local storage is limited at 5-10MB. Use IndexedDB/server-side database/cloud for larger.

If your game state contains complex objects like class instances, you may need to handle serialization and deserialization manually, as JSON.stringify/parse do not support this.

*/