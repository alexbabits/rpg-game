export class PlayerState {
    constructor(player) {this.player = player;}
    enter() {}
    update() {}
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
        console.log("Switching to special attack state");
        this.player.goto(this.player.specialAttackingState);
      } else if(this.player.userInput.cursors.space.isDown && playerVelocity.x === 0 && playerVelocity.y === 0) {
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
      console.log("Player entered walking state");
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
      console.log("Player entered running state");
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
      this.player.sprite.once('animationcomplete', this.handleAnimationComplete, this);
      console.log("Player entered attack state");
      this.player.sprite.anims.play('hero_attack', true);
    }
  
    update() {
      const playerVelocity = this.player.sprite.body.velocity;
      
      if(!this.player.userInput.cursors.space.isDown || playerVelocity.x !== 0 || playerVelocity.y !== 0) {
        this.player.goto(this.player.idleState);
      }
    }
  
    handleAnimationComplete() {
      this.player.goto(this.player.idleState);
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
      
      if(!this.player.userInput.cursors.space.isDown || !this.player.userInput.cursors.ctrl.isDown || playerVelocity.x !== 0 || playerVelocity.y !== 0) {
        this.player.goto(this.player.idleState);
      }
    }
  
    handleAnimationComplete() {
      this.player.goto(this.player.idleState);
    }
  }


  //PlayerDeathState
  //PlayerLootingState
  //PlayerGettingHitState