//import MonsterDeathState from "./MonsterState.js";

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
    }
  
    update() {
      const {x, y} = this.player.getMovement();
      const playerVelocity = this.player.sprite.body.velocity;
      const isPlayerMoving = x !== 0 || y !== 0;
      if(this.player.userInput.cursors.space.isDown && this.player.userInput.cursors.ctrl.isDown && playerVelocity.x === 0 && playerVelocity.y === 0) {
        this.player.transitionToNewState(this.player.specialAttackingState);
      } else if(this.player.userInput.cursors.space.isDown && playerVelocity.x === 0 && playerVelocity.y === 0) {
        this.player.transitionToNewState(this.player.attackingState);
      } else if (isPlayerMoving && this.player.userInput.cursors.shift.isDown) {
        this.player.transitionToNewState(this.player.runningState);
      } else if (isPlayerMoving) {
        this.player.transitionToNewState(this.player.walkingState);
      }
    }
    exit() {}
  }
  
  export class PlayerWalkState extends PlayerState {
    enter() {
      this.player.sprite.anims.play('hero_walk', true);
      console.log("Player entered walking state");
  
      if (!this.staminaDecrementTimer) {
        this.staminaDecrementTimer = this.player.scene.time.addEvent({
          delay: 600,
          callback: () => {
            if (this.player.stamina < this.player.maxStamina) {
              this.player.stamina++;
              this.player.staminaBar.draw();
            }

            if (this.player.stamina === 1 && !this.player.runCooldownTimer) {
              this.player.runCooldownTimer = this.player.scene.time.delayedCall(600, () => {
                this.player.canRun = true;
                this.player.runCooldownTimer = null;
              }, [], this);
            }
          },
          loop: true
        });
      }
    }
  
    update() {
      const {x, y} = this.player.getMovement();
      
      if (x === 0 && y === 0) {
        this.player.transitionToNewState(this.player.idleState);
      } else if (this.player.userInput.cursors.shift.isDown && this.player.canRun) {
        this.player.transitionToNewState(this.player.runningState);
      }
      this.player.setMovement();
    }
  
    exit() {
      if (this.staminaDecrementTimer) {
        this.staminaDecrementTimer.destroy();
        this.staminaDecrementTimer = null;
      }
      if (this.runCooldownTimer) {
        this.runCooldownTimer.remove();
        this.runCooldownTimer = null;
      }
    }
  }
  
export class PlayerRunState extends PlayerState {
  enter() {
    this.player.sprite.anims.play('hero_run', true);
    console.log("Player entered running state");

    if (!this.staminaDecrementTimer) {
      this.staminaDecrementTimer = this.player.scene.time.addEvent({
        delay: 200,
        callback: () => {
          if (this.player.stamina > 0) {
            this.player.stamina--;
            this.player.staminaBar.draw();
          }
        },
        loop: true
      });
    }
  }

  update() {
    const {x, y} = this.player.getMovement();

    if (this.player.stamina === 0) {
      this.player.canRun = false;
    }

    if (x === 0 && y === 0) {
      this.player.transitionToNewState(this.player.idleState);
    } else if (!this.player.userInput.cursors.shift.isDown || !this.player.canRun) {
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
      if (this.player.sprite.anims.currentFrame.textureFrame === 'hero_attack_5' && !this.damageApplied) {
        this.handleAttack();
        this.damageApplied = true;
      }
    
      if(!this.player.userInput.cursors.space.isDown || playerVelocity.x !== 0 || playerVelocity.y !== 0 || this.player.sprite.anims.currentAnim.key !== 'hero_attack') {
        this.player.transitionToNewState(this.player.idleState);
      }
    }
  
    handleAttack() {
      for(let monsterSprite of this.player.monstersTouching){
        let monster = monsterSprite.monsterInstance;
        if (monster.HP > 0) {
          monster.HP -= this.player.playerDamage;
          monster.sprite.setTint(0xff0000);
          setTimeout(() => monster.sprite.clearTint(), 200);
          console.log(`Player attacked ${monster.name} for ${this.player.playerDamage} damage. Monster health: ${monster.HP}`);
        }
        if (monster.HP <= 0) {
          this.player.monstersTouching = this.player.monstersTouching.filter(m => m !== monsterSprite);
          monster.handleMonsterDeath();
        }
      }
    }
  
    exit() {
      this.player.sprite.off('animationstart', this.handleAnimationReset, this);
      this.player.sprite.off('animationrepeat', this.handleAnimationReset, this);
    }
  }


  export class PlayerSpecialAttackState extends PlayerState {
    enter() {
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
      if (this.player.sprite.anims.currentFrame.textureFrame === 'hero_crit_4' && !this.damageApplied) {
        this.handleAttack();
        this.damageApplied = true;
      }

      if(!this.player.userInput.cursors.space.isDown || !this.player.userInput.cursors.ctrl.isDown || playerVelocity.x !== 0 || playerVelocity.y !== 0 || this.player.sprite.anims.currentAnim.key !== 'hero_crit') {
        this.player.transitionToNewState(this.player.idleState);
      }
    }
  
    handleAttack() {
      for(let monsterSprite of this.player.monstersTouching){
        let monster = monsterSprite.monsterInstance;
        if (monster.HP > 0) {
          monster.HP -= this.player.playerSpecialDamage;
          monster.sprite.setTint(0xff0000);
          setTimeout(() => monster.sprite.clearTint(), 200);
          console.log(`Player special attacked ${monster.name} for ${this.player.playerSpecialDamage} damage. Monster health: ${monster.HP}`);
        }
        if (monster.HP <= 0) {
          this.player.monstersTouching = this.player.monstersTouching.filter(m => m !== monsterSprite);
          monster.handleMonsterDeath();
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
  }
}