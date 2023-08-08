export default class Teleporter {
    constructor(scene, player, x, y) {
        this.scene = scene;
        this.player = player;
    
        const { Bodies } = Phaser.Physics.Matter.Matter;
        //const teleporterSensor = Bodies.circle(x, y, 16, { isSensor: true, label: 'teleporterSensor' });
        const teleporterSensor = Bodies.rectangle(x, y, 40, 26, {chamfer: { radius: [15, 15, 15, 15] }, isSensor: true,label: 'teleporterSensor'});
    
        this.sprite = this.scene.matter.add.sprite(x, y, 'teleporter').setDepth(2).setScale(1);
        this.sprite.setExistingBody(teleporterSensor);
        this.sprite.setFrame('teleporter_1');
        this.scene.matter.world.on('collisionstart', this.handleCollision, this);
        this.sprite.on('animationcomplete', this.handleAnimationComplete, this);
    }

    handleCollision(event) {
        for (let i = 0; i < event.pairs.length; i++) {
          const bodyA = event.pairs[i].bodyA;
          const bodyB = event.pairs[i].bodyB;

          if ((bodyA.label === 'playerFeetSensor' && bodyB.label === 'teleporterSensor') ||
              (bodyA.label === 'teleporterSensor' && bodyB.label === 'playerFeetSensor')) {
            this.teleport();
          }
        }
    }

    teleport(){
        this.sprite.anims.play('teleport');
        this.player.transitionToNewState(this.player.teleportingState);
    }

    teleportToDestination() {
        this.scene.transitionToScene('Map2', 340, 460);
      }

    handleAnimationComplete(animation, frame) {
        if (animation.key === 'teleport') {
          this.teleportToDestination();
        }
    }

}