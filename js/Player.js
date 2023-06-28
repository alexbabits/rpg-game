import UserInput from './UserInput.js';

export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.walkSpeed = 2;
    this.runSpeed = 4;

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
  }

  static preload(scene) {
    scene.load.atlas('hero', 'assets/images/hero.png', 'assets/images/hero_atlas.json');
    scene.load.animation('hero_anims', 'assets/images/hero_anims.json');
  }

update() {
    const cursors = this.userInput.cursors;
    let velocity = new Phaser.Math.Vector2();

    if (cursors.left.isDown) {
      velocity.x -= 1;
    }

    if (cursors.right.isDown) {
      velocity.x += 1;
    }

    if (cursors.up.isDown) {
      velocity.y -= 1;
    }

    if (cursors.down.isDown) {
      velocity.y += 1;
    }

    if (velocity.length() > 0.1) {
      velocity.normalize().scale(cursors.shift.isDown ? this.runSpeed : this.walkSpeed);

      this.sprite.setVelocity(velocity.x, velocity.y);
      
      if (velocity.x < 0) {
        this.sprite.setFlipX(true);
      } else if (velocity.x > 0) {
        this.sprite.setFlipX(false);
      }
      
      this.sprite.anims.play(cursors.shift.isDown ? 'hero_run' : 'hero_walk', true);
    } else {
      this.sprite.setVelocity(0, 0);
      this.sprite.anims.play('hero_idle', true);
    }
  }

}