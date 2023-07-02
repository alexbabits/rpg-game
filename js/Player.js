import UserInput from './UserInput.js';
import {PlayerIdleState, PlayerWalkState, PlayerRunState, PlayerAttackState, PlayerSpecialAttackState, PlayerGotHitState, PlayerDeathState} from './PlayerState.js';

export default class Player {

  static preload(scene) {
    scene.load.atlas('hero', 'assets/images/hero.png', 'assets/images/hero_atlas.json');
    scene.load.animation('hero_anims', 'assets/images/hero_anims.json');
  }

  constructor(scene, x, y) {
    this.scene = scene;
    this.walkSpeed = 2;
    this.runSpeed = 4;
    this.maxHP = 20;
    this.HP = 200000;
    this.playerDamage = 100;
    this.playerSpecialDamage = this.playerDamage*2;
    this.direction = 'Right';
    
    const {Body,Bodies} = Phaser.Physics.Matter.Matter;
    this.playerCollider = Bodies.rectangle(x, y, 22, 32, {chamfer: {radius: 10}, isSensor:false, label:'playerCollider'});
    this.playerSensor1 = Bodies.rectangle(x + 15, y, 20, 8, {isSensor: true, label:'playerAttackSensorRight', parent: this})
    this.playerSensor2 = Bodies.rectangle(x - 15, y, 20, 8, {isSensor: true, label:'playerAttackSensorLeft', parent: this})
    const compoundBody = Body.create({parts:[this.playerCollider, this.playerSensor1, this.playerSensor2], frictionAir: .4});

    this.sprite = this.scene.matter.add.sprite(x, y, 'hero');
    this.sprite.setDepth(5);
    this.sprite.setExistingBody(compoundBody);
    this.sprite.setFixedRotation();

    this.sprite.anims.play('hero_idle');
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
  }

  transitionToNewState(newState) {
    this.currentState = newState;
    this.currentState.enter();
  }

  playerGotHit() {
    if(this.HP > 0) {
        this.transitionToNewState(this.gotHitState);
    } else {
        this.transitionToNewState(this.deathState);
    }
  }

  update() {
    this.currentState.update();
    //console.log(`${this.monstersTouching.length}`);
  }

}