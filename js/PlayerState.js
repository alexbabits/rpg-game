export class PlayerState {
    constructor(player) {this.player = player;}
    enter() {}
    update() {}
    exit() {}
  }
  
export class PlayerIdleState extends PlayerState {
    enter() {
      console.log("Player entered idle state");
      this.player.sprite.anims.play('hero_idle', true);

      if (!this.staminaIncrementTimer) {
        this.staminaIncrementTimer = this.player.scene.time.addEvent({
          delay: 100,
          callback: () => {
              this.player.gameState.setPlayerStamina(this.player.gameState.getPlayerStamina() + 1);
          },
          loop: true
        });
      }
    }
  
    update() {
      const {x, y} = this.player.getMovement();
      const playerVelocity = this.player.sprite.body.velocity;
      const isPlayerMoving = x !== 0 || y !== 0;

      if(this.player.userInput.cursors.space.isDown && this.player.userInput.cursors.ctrl.isDown && playerVelocity.x === 0 && playerVelocity.y === 0 && this.player.gameState.getPlayerStamina() >= this.player.gameState.getPlayerSpAttStaminaCost() && this.player.gameState.getPlayerMana() >= this.player.gameState.getPlayerSpAttManaCost()) {
        this.player.transitionToNewState(this.player.specialAttackingState);
      } else if(this.player.userInput.cursors.space.isDown && playerVelocity.x === 0 && playerVelocity.y === 0 && this.player.gameState.getPlayerStamina() >= this.player.gameState.getPlayerAttStaminaCost()) {
        this.player.transitionToNewState(this.player.attackingState);
      } else if (isPlayerMoving && this.player.userInput.cursors.shift.isDown) {
        this.player.transitionToNewState(this.player.runningState);
      } else if (isPlayerMoving) {
        this.player.transitionToNewState(this.player.walkingState);
      }
    }
    exit() {
      if (this.staminaIncrementTimer) {
        this.staminaIncrementTimer.destroy();
        this.staminaIncrementTimer = null;
      }
    }
}
  
export class PlayerWalkState extends PlayerState {
  enter() {
    this.player.sprite.anims.play('hero_walk', true);
    console.log("Player entered walking state");

    if (!this.staminaIncrementTimer) {
      this.staminaIncrementTimer = this.player.scene.time.addEvent({
        delay: 600,
        callback: () => {
          if (this.player.gameState.getPlayerStamina() <= this.player.gameState.getPlayerMaxStamina()) {
            this.player.gameState.setPlayerStamina(this.player.gameState.getPlayerStamina() + 1);
          }
        },
        loop: true
      });
    }
  }

  update() {
    const {x, y} = this.player.getMovement();
    if (this.player.gameState.getPlayerStamina() >= 3) {
      this.player.gameState.setPlayerCanRun(true);
    }
    if (x === 0 && y === 0) {
      this.player.transitionToNewState(this.player.idleState);
    } else if (this.player.userInput.cursors.shift.isDown && this.player.gameState.getPlayerCanRun()) {
      this.player.transitionToNewState(this.player.runningState);
    }
    this.player.setMovement();
  }

  exit() {
    if (this.staminaIncrementTimer) {
      this.staminaIncrementTimer.destroy();
      this.staminaIncrementTimer = null;
    }
  }
}
  
export class PlayerRunState extends PlayerState {
  enter() {
    this.player.gameState.setPlayerStamina(this.player.gameState.getPlayerStamina() - 1)
    this.player.sprite.anims.play('hero_run', true);
    console.log("Player entered running state");

    if (!this.staminaDecrementTimer) {
      this.staminaDecrementTimer = this.player.scene.time.addEvent({
        delay: 200,
        callback: () => {
          if (this.player.gameState.getPlayerStamina() > 0) {
            this.player.gameState.setPlayerStamina(this.player.gameState.getPlayerStamina() - 1);
          }
        },
        loop: true
      });
    }
  }

  update() {
    const {x, y} = this.player.getMovement();

    if (this.player.gameState.getPlayerStamina() === 0) {
      this.player.gameState.setPlayerCanRun(false);
    } else if (this.player.gameState.getPlayerStamina() >= 3) {
      this.player.gameState.setPlayerCanRun(true);
    }

    if (x === 0 && y === 0) {
      this.player.transitionToNewState(this.player.idleState);
    } else if (!this.player.userInput.cursors.shift.isDown || !this.player.gameState.getPlayerCanRun()) {
      this.player.transitionToNewState(this.player.walkingState);
    }
    this.player.setMovement(true);
  }

  exit() {
    if (this.staminaDecrementTimer) {
      this.staminaDecrementTimer.destroy();
      this.staminaDecrementTimer = null;
    }
  }
}

export class PlayerAttackState extends PlayerState {
    enter() {
      this.player.sprite.on('animationstart', this.handleAnimationReset, this);
      this.player.sprite.on('animationrepeat', this.handleAnimationReset, this);
      console.log("Player entered attack state");
      this.player.sprite.anims.play('hero_attack', true);
      this.damageApplied = false;
    }
  
    handleAnimationReset(animation, frame) {
      if (animation.key === 'hero_attack') {
        this.damageApplied = false;
      }
    }
  
    update() {
      const playerVelocity = this.player.sprite.body.velocity;
      if (this.player.gameState.getPlayerStamina() < this.player.gameState.getPlayerAttStaminaCost()) {
        this.player.transitionToNewState(this.player.idleState);
      } else if (this.player.sprite.anims.currentFrame.textureFrame === 'hero_attack_5' && !this.damageApplied && this.player.gameState.getPlayerStamina() >= this.player.gameState.getPlayerAttStaminaCost()) {
        this.handleAttack();
        this.damageApplied = true;
      }
        
      if(!this.player.userInput.cursors.space.isDown || playerVelocity.x !== 0 || playerVelocity.y !== 0 || this.player.sprite.anims.currentAnim.key !== 'hero_attack') {
        this.player.transitionToNewState(this.player.idleState);
      }
    }
  
    handleAttack() {
      this.player.gameState.setPlayerStamina(this.player.gameState.getPlayerStamina() - this.player.gameState.getPlayerAttStaminaCost());
      for(let monsterSprite of this.player.monstersTouching){
        let monster = monsterSprite.monsterInstance;
        if (monster.HP > 0) {
          const netDamage = Math.max(0, this.player.gameState.getPlayerDamage() - monster.Defense);
          monster.HP -= netDamage;
          monster.sprite.setTint(0xff0000);
          setTimeout(() => monster.sprite.clearTint(), 200);
          console.log(`Player attacked ${monster.name} for ${netDamage} damage. Monster health: ${monster.HP}`);
          monster.sprite.emit('monsterDamageTaken', netDamage);
        }
        if (monster.HP <= 0) {
          monster.transitionToNewState(monster.deathState);
        }
      }
    }
  
    exit() {
      this.player.sprite.off('animationstart', this.handleAnimationReset, this);
      this.player.sprite.off('animationrepeat', this.handleAnimationReset, this);
    }
  }


export class PlayerSpecialAttackState extends PlayerState {
    static stateName = 'specialAttacking';
    enter() {
      this.name = PlayerSpecialAttackState.stateName;
      this.player.sprite.on('animationstart', this.handleAnimationReset, this);
      this.player.sprite.on('animationrepeat', this.handleAnimationReset, this);
      console.log("Player entered special attack state");
      this.player.sprite.anims.play('hero_crit', true);
      this.damageApplied = false;
    }

    handleAnimationReset(animation, frame) {
      if (animation.key === 'hero_crit') {
        this.damageApplied = false;
      }
    }
  
    update() {
      const playerVelocity = this.player.sprite.body.velocity;
      if (this.player.gameState.getPlayerStamina() < this.player.gameState.getPlayerSpAttStaminaCost() || this.player.gameState.getPlayerMana() < this.player.gameState.getPlayerSpAttManaCost()){
        this.player.transitionToNewState(this.player.idleState);
      } else if (this.player.sprite.anims.currentFrame.textureFrame === 'hero_crit_4' && !this.damageApplied && this.player.gameState.getPlayerStamina() >= this.player.gameState.getPlayerSpAttStaminaCost() && this.player.gameState.getPlayerMana() >= this.player.gameState.getPlayerSpAttManaCost()) {
        this.handleAttack();
        this.damageApplied = true;
      }

      if(!this.player.userInput.cursors.space.isDown || !this.player.userInput.cursors.ctrl.isDown || playerVelocity.x !== 0 || playerVelocity.y !== 0 || this.player.sprite.anims.currentAnim.key !== 'hero_crit') {
        this.player.transitionToNewState(this.player.idleState);
      }
    }
  
    handleAttack() {
      this.player.gameState.setPlayerMana(this.player.gameState.getPlayerMana() - this.player.gameState.getPlayerSpAttManaCost());
      this.player.gameState.setPlayerStamina(this.player.gameState.getPlayerStamina() - this.player.gameState.getPlayerSpAttStaminaCost());
      for(let monsterSprite of this.player.monstersTouching){
        let monster = monsterSprite.monsterInstance;
        if (monster.HP > 0) {
          const netSpecialDamage = Math.max(0, this.player.gameState.getPlayerSpecialDamage() - monster.Defense);
          monster.HP -= netSpecialDamage
          monster.sprite.setTint(0xff0000);
          setTimeout(() => monster.sprite.clearTint(), 200);
          console.log(`Player special attacked ${monster.name} for ${netSpecialDamage} damage. Monster health: ${monster.HP}`);
          monster.sprite.emit('monsterSpecialDamageTaken', netSpecialDamage);
        }
        if (monster.HP <= 0) {
          monster.transitionToNewState(monster.deathState);
        }
      }
    }
  
    exit() {
      this.player.sprite.off('animationstart', this.handleAnimationReset, this);
      this.player.sprite.off('animationrepeat', this.handleAnimationReset, this);
    }
  }

export class PlayerGotHitState extends PlayerState {
    enter() {
        console.log("Player entered GotHitState");
        this.player.sprite.once('animationcomplete', this.handleAnimationComplete, this);
        this.player.sprite.anims.play('hero_damage', true);
        this.player.sprite.setTint(0xff0000);
    }
    update() {}
    exit() {}
    handleAnimationComplete() {
      this.player.transitionToNewState(this.player.idleState);
      this.player.sprite.clearTint();
    }
}

export class PlayerDeathState extends PlayerState {
  enter() {
      console.log("Player entered death state");
      this.player.sprite.once('animationcomplete', this.handleAnimationComplete, this);
      this.player.sprite.anims.play('hero_death', true);
  }

  update() {}
  exit() {}
  handleAnimationComplete() {
    this.player.sprite.setActive(false);
    this.player.sprite.setVisible(false);
    this.player.scene.time.delayedCall(500, () => {
        for (let key in this.player.scene.scene.manager.scenes) {
            if (key !== 'DeathScene') {
                this.player.scene.scene.manager.scenes[key].scene.stop();
            }
        }
        this.player.scene.scene.start('DeathScene');
    });
  }
}

export class PlayerTeleportingState extends PlayerState {
  enter() {
    console.log("Player entered teleporting state");
    this.player.sprite.anims.play('hero_idle', true);
    this.player.sprite.setVelocity(0, 0);
  }

  update() {
    // In this state, we don't allow any transitions or actions.
    // The player remains in this state until the teleportation is complete.
  }

  exit() {
    // You can place any logic here that should be executed when leaving the teleporting state
  }
}