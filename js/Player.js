import UserInput from './UserInput.js';
import {PlayerIdleState, PlayerWalkState, PlayerRunState, PlayerAttackState, PlayerSpecialAttackState} from './PlayerState.js';

export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.walkSpeed = 2;
    this.runSpeed = 4;
    this.maxHP = 20;
    this.HP = 20;
    
    const {Body,Bodies} = Phaser.Physics.Matter.Matter;
    this.playerCollider = Bodies.rectangle(x, y, 22, 32, {chamfer: {radius: 10}, isSensor:false, label:'playerCollider'});
    this.playerSensor = {
      right: Bodies.rectangle(x + 15, y, 20, 8, {isSensor: true}, {label:'right'}),
      left: Bodies.rectangle(x - 15, y, 20, 8, {isSensor: true}, {label:'left'})
    };
    const compoundBody = Body.create({parts:[this.playerCollider, this.playerSensor.right, this.playerSensor.left], frictionAir: .4});

    this.sprite = this.scene.matter.add.sprite(x, y, 'hero');
    this.sprite.setDepth(1);
    this.sprite.setExistingBody(compoundBody);
    this.sprite.setFixedRotation();

    this.sprite.anims.play('hero_idle');
    this.userInput = new UserInput(this.scene);
    this.idleState = new PlayerIdleState(this);
    this.walkingState = new PlayerWalkState(this);
    this.runningState = new PlayerRunState(this);
    this.attackingState = new PlayerAttackState(this);
    this.specialAttackingState = new PlayerSpecialAttackState(this);
    this.currentState = this.idleState;
  }

  static preload(scene) {
    scene.load.atlas('hero', 'assets/images/hero.png', 'assets/images/hero_atlas.json');
    scene.load.animation('hero_anims', 'assets/images/hero_anims.json');
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
  } else if (x > 0) {
    this.sprite.setFlipX(false);
  }
}

  goto(state) {
    this.currentState = state;
    this.currentState.enter();
  }

  update() {
    this.currentState.update();
  }

}