export class PlayerState {
    constructor(player) {this.player = player;}
    enter() {}
    update() {}
  }
  
  export class PlayerIdleState extends PlayerState {
    enter() {
      this.player.sprite.anims.play('hero_idle', true);
    }
  
    update() {
      const {x, y} = this.player.getMovement();
      const playerVelocity = this.player.sprite.body.velocity;
      const isPlayerMoving = x !== 0 || y !== 0;
    
      if(this.player.userInput.cursors.space.isDown && playerVelocity.x === 0 && playerVelocity.y === 0) {
        console.log("Switching to attack state");
        this.player.goto(this.player.attackingState);
      } else if (isPlayerMoving && this.player.userInput.cursors.shift.isDown) {
        this.player.goto(this.player.runningState);
      } else if (isPlayerMoving) {
        this.player.goto(this.player.walkingState);
      }
    }
  }
  
  export class PlayerWalkState extends PlayerState {
    enter() {
      this.player.sprite.anims.play('hero_walk', true);
    }
  
    update() {
      const {x, y} = this.player.getMovement();
  
      if (x === 0 && y === 0) {
        this.player.goto(this.player.idleState);
      } else if (this.player.userInput.cursors.shift.isDown) {
        this.player.goto(this.player.runningState);
      }
  
      this.player.setMovement();
    }
  }
  
  export class PlayerRunState extends PlayerState {
    enter() {
      this.player.sprite.anims.play('hero_run', true);
    }
  
    update() {
      const {x, y} = this.player.getMovement();
  
      if (x === 0 && y === 0) {
        this.player.goto(this.player.idleState);
      } else if (!this.player.userInput.cursors.shift.isDown) {
        this.player.goto(this.player.walkingState);
      }
  
      this.player.setMovement(true);
    }
  }

  export class PlayerAttackState extends PlayerState {
    enter() {
      console.log("Entered attack state");
      this.player.sprite.once('animationcomplete', this.handleAnimationComplete, this);
      this.player.sprite.anims.play('hero_attack', true);
    }
    
    update() {
      const playerVelocity = this.player.sprite.body.velocity;
      
      if(this.player.userInput.cursors.space.isDown && playerVelocity.x === 0 && playerVelocity.y === 0) {
        // Stay in this state
      } else {
        // Transition back to idle state if the attack key is not pressed
        this.player.goto(this.player.idleState);
      }
    }
  
    handleAnimationComplete() {
      this.player.goto(this.player.idleState);
    }
  }
  
  export class PlayerSpecialAttackState extends PlayerState {
    enter() {
      this.player.sprite.anims.play('hero_crit', true);
    }
    
    update() {
      const playerVelocity = this.player.sprite.body.velocity;
  
      if(this.player.sprite.anims.getCurrentKey() === 'hero_crit' && this.player.sprite.anims.currentFrame.index === 7) {
        this.player.goto(this.player.idleState);
      } else if(this.player.userInput.cursors.space.isDown && this.player.userInput.cursors.ctrl.isDown && playerVelocity.x === 0 && playerVelocity.y === 0) {
        // Stay in this state
      } else {
        // Transition back to idle state if the attack key is not pressed
        this.player.goto(this.player.idleState);
      }
    }
  }

  //PlayerDeathState
  //PlayerAttackingState
  //PlayerSpecialAttackState
  //PlayerLootingState
  //PlayerGettingHitState