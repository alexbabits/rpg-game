import UserInput from './UserInput.js';
import {PlayerIdleState, PlayerWalkState, PlayerRunState, PlayerAttackState, PlayerSpecialAttackState, PlayerGotHitState, PlayerDeathState} from './PlayerState.js';
import {HPBar, StaminaBar, ManaBar} from './PlayerBars.js'

export default class Player {

  static preload(scene) {
    scene.load.atlas('hero', 'assets/images/hero.png', 'assets/images/hero_atlas.json');
    scene.load.animation('hero_anims', 'assets/images/hero_anims.json');
  }

  constructor(scene, x, y) {
    this.scene = scene;
    this.XP = 0;
    this.maxXP = 50;
    this.level = 1;
    this.totalXP = 0;
    this.walkSpeed = 2;
    this.runSpeed = 4;
    this.maxHP = 200;
    this.HP = 200;
    this.maxMana = 20;
    this.mana = 20;
    this.manaRegeneration();
    this.maxStamina = 100;
    this.stamina = 100;
    this.canRun = true;
    this.runCooldownTimer = null;
    this.playerDamage = 100;
    this.playerSpecialDamage = this.playerDamage*2.5;
    this.direction = 'Right';
    
    const {Body,Bodies} = Phaser.Physics.Matter.Matter;
    this.playerCollider = Bodies.rectangle(x, y, 22, 32, {chamfer: {radius: 10}, isSensor:false, label:'playerCollider'});
    this.playerSensor1 = Bodies.rectangle(x + 15, y, 20, 8, {isSensor: true, label:'playerAttackSensorRight'})
    this.playerSensor2 = Bodies.rectangle(x - 15, y, 20, 8, {isSensor: true, label:'playerAttackSensorLeft'})
    const compoundBody = Body.create({parts:[this.playerCollider, this.playerSensor1, this.playerSensor2], frictionAir: .4});

    this.sprite = this.scene.matter.add.sprite(x, y, 'hero');
    this.sprite.setDepth(5);
    this.sprite.setExistingBody(compoundBody);
    this.sprite.setFixedRotation();
    this.sprite.anims.play('hero_idle');

    this.hpBar = new HPBar(this.scene, 112, 110, this);
    this.staminaBar = new StaminaBar(this.scene, 112, 210, this);
    this.manaBar = new ManaBar(this.scene, 112, 310, this);

    this.userInput = new UserInput(this.scene);
    this.idleState = new PlayerIdleState(this);
    this.walkingState = new PlayerWalkState(this);
    this.runningState = new PlayerRunState(this);
    this.attackingState = new PlayerAttackState(this);
    this.specialAttackingState = new PlayerSpecialAttackState(this);
    this.gotHitState = new PlayerGotHitState(this);
    this.deathState = new PlayerDeathState(this);
    this.scene.events.on('playerGotHit', this.playerGotHit, this);
    this.currentState = this.idleState;
    this.monstersTouching = [];
    this.scene.matter.world.on('collisionactive', this.handleCollision, this);


    this.scene.events.on('monsterDeath', this.gainXP, this);
  }

  gainXP(monster) {
    this.XP += monster.XP;
    this.totalXP += monster.XP;
    console.log(`Player gained ${monster.XP} XP. Total XP: ${this.totalXP}. XP to next level: ${this.xpToNextLevel()}`);
    if (this.XP >= this.maxXP) {
      this.levelUp();
    }
  }
  
  levelUp() {
    this.level++;
    this.XP = 0;
    this.maxXP = Math.ceil(this.maxXP * 1.5);
    console.log(`Player leveled up! Current level: ${this.level}. XP needed for next level: ${this.maxXP}. XP to next level: ${this.xpToNextLevel()}`);
  }

  xpToNextLevel() {
    return this.maxXP - this.XP;
  }

  get HP() {return this._HP;}
  set HP(value) {this._HP = Math.max(0, Math.min(value, this.maxHP));}

  get stamina() {return this._stamina;}
  set stamina(value) {this._stamina = Math.max(0, Math.min(value, this.maxStamina));}

  get mana() {return this._mana;}
  set mana(value) {this._mana = Math.max(0, Math.min(value, this.maxMana));}

  manaRegeneration() {
    this.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        if (this.mana < this.maxMana && this.currentState.name !== PlayerSpecialAttackState.stateName) {
          this.mana++;
          this.manaBar.draw();
        }
      },
      loop: true
    });
  }
  // For when the player object is removed from the game (level ends, player dies, exiting game)
  destroy() {
    if (this.runCooldownTimer) {
      this.runCooldownTimer.remove();
      this.runCooldownTimer = null;
    }
  }

  handleCollision(event) {
    this.monstersTouching = [];
    for (let pair of event.pairs) {
      if ((pair.bodyA.label.includes(`playerAttackSensor${this.direction}`) && pair.bodyB.label === 'monsterCollider')
          || (pair.bodyB.label.includes(`playerAttackSensor${this.direction}`) && pair.bodyA.label === 'monsterCollider')) {
          let monsterBody = pair.bodyA.label === 'monsterCollider' ? pair.bodyA : pair.bodyB;
          this.monstersTouching.push(monsterBody.gameObject);
      }
    }
  }

  getMovement() {
    let x = 0;
    let y = 0;
  
    if (this.userInput.cursors.left.isDown) {
      x = -1;
    } else if (this.userInput.cursors.right.isDown) {
      x = 1;
    }
    if (this.userInput.cursors.up.isDown) {
      y = -1;
    } else if (this.userInput.cursors.down.isDown) {
      y = 1;
    }
    return {x, y};
  }
  
  setMovement(isRunning = false) {
    const speed = isRunning ? this.runSpeed : this.walkSpeed;
    let {x, y} = this.getMovement();
  
    if(x !== 0 || y !== 0) {
      let direction = new Phaser.Math.Vector2(x, y);
      direction.normalize();
      x = direction.x;
      y = direction.y;
    }
  
    this.sprite.setVelocity(x * speed, y * speed);
  
    if (x < 0) {
      this.sprite.setFlipX(true);
      this.direction = 'Left';
    } else if (x > 0) {
      this.sprite.setFlipX(false);
      this.direction = 'Right';
    }
  
    if (this.stamina === 0 && !this.runCooldownTimer) {
      this.canRun = false;
      this.runCooldownTimer = this.scene.time.delayedCall(1200, () => {
        this.canRun = true;
        this.runCooldownTimer = null;
      }, [], this);
    }
  }

  transitionToNewState(newState) {
    this.currentState.exit();
    this.currentState = newState;
    this.currentState.enter();
  }

  playerGotHit() {
    this.hpBar.draw()
    if(this.HP > 0) {
        this.transitionToNewState(this.gotHitState);
    } else {
        this.transitionToNewState(this.deathState);
    }
  }

  update() {
    this.currentState.update();
  }

}