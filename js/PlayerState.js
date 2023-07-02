export class PlayerState {
    constructor(player) {this.player = player;}
    enter() {}
    update() {
      if (this.player.HP <= 0) {
        this.player.transitionToNewState(this.player.deathState);
      }
    }
    exit() {}
  }
  
  export class PlayerIdleState extends PlayerState {
    enter() {
      //console.log("Player entered idle state");
      this.player.sprite.anims.play('hero_idle', true);
    }
  
    update() {
      const {x, y} = this.player.getMovement();
      const playerVelocity = this.player.sprite.body.velocity;
      const isPlayerMoving = x !== 0 || y !== 0;
      if (this.player.HP <= 0) {
        this.player.transitionToNewState(this.player.deathState);
      }
      if(this.player.userInput.cursors.space.isDown && this.player.userInput.cursors.ctrl.isDown && playerVelocity.x === 0 && playerVelocity.y === 0) {
        console.log("Switching to special attack state");
        this.player.transitionToNewState(this.player.specialAttackingState);
      } else if(this.player.userInput.cursors.space.isDown && playerVelocity.x === 0 && playerVelocity.y === 0) {
        console.log("Switching to attack state");
        this.player.transitionToNewState(this.player.attackingState);
      } else if (isPlayerMoving && this.player.userInput.cursors.shift.isDown) {
        this.player.transitionToNewState(this.player.runningState);
      } else if (isPlayerMoving) {
        this.player.transitionToNewState(this.player.walkingState);
      }
    }
  }
  
  export class PlayerWalkState extends PlayerState {
    enter() {
      this.player.sprite.anims.play('hero_walk', true);
      //console.log("Player entered walking state");
    }
  
    update() {
      const {x, y} = this.player.getMovement();
      if (this.player.HP <= 0) {
        this.player.transitionToNewState(this.player.deathState);
      }
      if (x === 0 && y === 0) {
        this.player.transitionToNewState(this.player.idleState);
      } else if (this.player.userInput.cursors.shift.isDown) {
        this.player.transitionToNewState(this.player.runningState);
      }
  
      this.player.setMovement();
    }
  }
  
  export class PlayerRunState extends PlayerState {
    enter() {
      this.player.sprite.anims.play('hero_run', true);
      //console.log("Player entered running state");
    }
  
    update() {
      const {x, y} = this.player.getMovement();
      if (this.player.HP <= 0) {
        this.player.transitionToNewState(this.player.deathState);
      }
      if (x === 0 && y === 0) {
        this.player.transitionToNewState(this.player.idleState);
      } else if (!this.player.userInput.cursors.shift.isDown) {
        this.player.transitionToNewState(this.player.walkingState);
      }
  
      this.player.setMovement(true);
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
      if (this.player.HP <= 0) {
        this.player.transitionToNewState(this.player.deathState);
      } else if (this.player.sprite.anims.currentFrame.textureFrame === 'hero_attack_5' && !this.damageApplied) {
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
          console.log(`Player attacked ${monster.name} for ${this.player.playerDamage} damage. Monster health: ${monster.HP}`);
        }
        if (monster.HP <= 0) {
          console.log(`${monster.name} is defeated.`);
          this.player.monstersTouching = this.player.monstersTouching.filter(m => m !== monsterSprite);
          // Do other cleanups here like removing the monster from the scene
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
      this.player.sprite.once('animationcomplete', this.handleAnimationComplete, this);
      console.log("Player entered special attack state");
      this.player.sprite.anims.play('hero_crit', true);
    }
  
    update() {
      const playerVelocity = this.player.sprite.body.velocity;
      if (this.player.HP <= 0) {
        this.player.transitionToNewState(this.player.deathState);
      }
      if(!this.player.userInput.cursors.space.isDown || !this.player.userInput.cursors.ctrl.isDown || playerVelocity.x !== 0 || playerVelocity.y !== 0) {
        this.player.transitionToNewState(this.player.idleState);
      }
    }
  
    handleAnimationComplete() {
      this.player.transitionToNewState(this.player.idleState);
    }
  }

  export class PlayerGotHitState extends PlayerState {
    enter() {
        //console.log("Player entered damage state");
        this.player.sprite.once('animationcomplete', this.handleAnimationComplete, this);
        this.player.sprite.anims.play('hero_damage', true);
        this.player.sprite.setTint(0xff0000);
    }
  
    update() {
      if (this.player.HP <= 0) {
        this.player.transitionToNewState(this.player.deathState);
      }
    }
  
    handleAnimationComplete() {
      this.player.transitionToNewState(this.player.idleState);
      this.player.sprite.clearTint();
    }
}

export class PlayerDeathState extends PlayerState {
  enter() {
      //console.log("Player entered death state");
      this.player.sprite.once('animationcomplete', this.handleAnimationComplete, this);
      this.player.sprite.anims.play('hero_death', true);
  }

  update() {}

  handleAnimationComplete() {
    this.player.sprite.setActive(false);
    this.player.sprite.setVisible(false);
  }
}


//PlayerLootingState