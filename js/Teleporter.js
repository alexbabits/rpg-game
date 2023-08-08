export default class Teleporter {
    constructor(scene, player, x, y) {
        this.scene = scene;
        this.player = player;
    
        const { Bodies } = Phaser.Physics.Matter.Matter;
        const teleporterSensor = Bodies.circle(x, y, 8, { isSensor: true, label: 'teleporterSensor' });
    
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

          if ((bodyA.label === 'playerInnerSensor' && bodyB.label === 'teleporterSensor') ||
              (bodyA.label === 'teleporterSensor' && bodyB.label === 'playerInnerSensor')) {
            this.teleport();
          }
        }
    }

    handleAnimationComplete(animation, frame) {
        if (animation.key === 'teleport') {
          this.transitionToMap2();
        }
    }

    teleport(){
        this.sprite.anims.play('teleport');
        this.player.transitionToNewState(this.player.teleportingState);
    }

    transitionToMap2() {
        this.scene.gameState.savePlayerState(this.scene.player);
        this.scene.gameState.saveInventoryState(this.scene.inventory);
        this.scene.gameState.saveEquipmentState(this.scene.equipment);
        this.scene.gameState.saveMessageBoxState(this.scene.messageBox);
        this.scene.gameState.saveTalentsState(this.scene.talents);
        this.scene.gameState.setPlayerPosition(340, 460);
        this.scene.scene.start('Map2');
      }
}