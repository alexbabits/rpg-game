export class Monster {

    static preload(scene) {
        scene.load.atlas('enemies', 'assets/images/enemies.png', 'assets/images/enemies_atlas.json');
        scene.load.animation('enemies_anims', 'assets/images/enemies_anims.json');
    }
    
    constructor(scene, x, y, key, frame, colliderWidth, colliderHeight, chamfer, sensorRadius, scale) {
        this.scene = scene;
        this.sprite = this.scene.matter.add.sprite(x, y, key, frame).setDepth(1).setScale(scale);
        
        const {Body,Bodies} = Phaser.Physics.Matter.Matter;

        this.collider = Bodies.rectangle(x, y, colliderWidth, colliderHeight, {chamfer: chamfer, isSensor: false, label:'monsterCollider', parent: this});
        this.sensor = Bodies.circle(x, y, sensorRadius, {isSensor: true, label:'monsterSensor', parent: this});
        const compoundBody = Body.create({parts:[this.collider, this.sensor], frictionAir: .35});
        
        this.sprite.setExistingBody(compoundBody);
        this.sprite.setFixedRotation();

        this.isAggressive = false;
    }

    update(player) {
        console.log(`Monster is aggressive: ${this.isAggressive}`);
        if(this.isAggressive) {
            if(Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, player.sprite.x, player.sprite.y) > 200) {
                this.isAggressive = false;
                this.sprite.setVelocity(0);
            } else {
                let velocity = Phaser.Physics.Matter.Matter.Vector.sub(player.sprite.body.position, this.sprite.body.position);
                velocity = Phaser.Physics.Matter.Matter.Vector.normalise(velocity);
                velocity = Phaser.Physics.Matter.Matter.Vector.mult(velocity, 1);
                this.sprite.setVelocity(velocity.x, velocity.y);
            }
        }
    }
}


export class Bear extends Monster {
    constructor(scene, x, y, key = 'enemies', frame) {
        super(scene, x, y, key, frame, 47, 35, {radius: [18, 21, 20, 12]}, 75, 0.75); 
        this.sprite.play('bear_idle'); 
    }

    update(player) {
        super.update(player);
    }
}

export class Ent extends Monster {
    constructor(scene, x, y, key = 'enemies', frame) {
        super(scene, x, y, key, frame, 20, 45, {radius: [7, 7, 7, 7]}, 60, 0.85);  
        this.sprite.play('ent_idle');
    }

    update(player) {
        super.update(player);
    }
}