export class Monster {

    static preload(scene) {
        scene.load.atlas('enemies', 'assets/images/enemies.png', 'assets/images/enemies_atlas.json');
        scene.load.animation('enemies_anims', 'assets/images/enemies_anims.json');
    }
    
    constructor(scene, x, y, key, frame, colliderWidth, colliderHeight, chamfer, sensorRadius, stoppingSensorRadius, scale, speed) {
        this.scene = scene;
        
        this.sprite = this.scene.matter.add.sprite(x, y, key, frame).setDepth(1).setScale(scale);
        
        const {Body,Bodies} = Phaser.Physics.Matter.Matter;

        this.collider = Bodies.rectangle(x, y, colliderWidth, colliderHeight, {chamfer: chamfer, isSensor: false, label:'monsterCollider', parent: this});
        this.aggressionSensor = Bodies.circle(x, y, sensorRadius, {isSensor: true, label:'monsterAggressionSensor', parent: this});
        this.stoppingSensor = Bodies.circle(x, y, stoppingSensorRadius, {isSensor: true, label:'monsterStoppingSensor', parent: this});
        const compoundBody = Body.create({parts:[this.collider, this.aggressionSensor, this.stoppingSensor], frictionAir: .35});
        
        this.sprite.setExistingBody(compoundBody);
        this.sprite.setFixedRotation();

        this.isAggressive = false;
        this.speed = speed;
        this.isStopping = false;
    }

    update(player) {
        if(this.isAggressive) {
            let distance = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, player.sprite.x, player.sprite.y);
    
            if(distance > 200) {
                console.log('player exited aggression zone')
                this.isAggressive = false;
                this.isStopping = false; // add this line
                this.sprite.setVelocity(0);
            } else if (!this.isStopping) { // update this line
                let velocity = Phaser.Physics.Matter.Matter.Vector.sub(player.sprite.body.position, this.sprite.body.position);
                velocity = Phaser.Physics.Matter.Matter.Vector.normalise(velocity);
                velocity = Phaser.Physics.Matter.Matter.Vector.mult(velocity, this.speed);
                this.sprite.setVelocity(velocity.x, velocity.y);
            }
        }
    }
}


export class Bear extends Monster {
    constructor(scene, x, y, key = 'enemies', frame) {
        super(scene, x, y, key, frame, 47, 35, {radius: [18, 21, 20, 12]}, 75, 40, 0.75, 1); 
        this.sprite.play('bear_idle'); 
    }

    update(player) {
        super.update(player);
    }
}

export class Ent extends Monster {
    constructor(scene, x, y, key = 'enemies', frame) {
        super(scene, x, y, key, frame, 20, 45, {radius: [7, 7, 7, 7]}, 60, 35, 0.85, 0.5);  
        this.sprite.play('ent_idle');
    }

    update(player) {
        super.update(player);
    }
}