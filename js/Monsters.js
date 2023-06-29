export class Monster {
    static preload(scene) {
        scene.load.atlas('enemies', 'assets/images/enemies.png', 'assets/images/enemies_atlas.json');
        scene.load.animation('enemies_anims', 'assets/images/enemies_anims.json');
    }
    
    constructor(scene, x, y, key, frame, colliderWidth, colliderHeight, chamfer, sensorRadius, scale) {
        this.scene = scene;
        this.sprite = this.scene.matter.add.sprite(x, y, key, frame).setDepth(1).setScale(scale);
        
        const {Body,Bodies} = Phaser.Physics.Matter.Matter;

        this.collider = Bodies.rectangle(x, y, colliderWidth, colliderHeight, {chamfer: chamfer, isSensor: false, label:'monsterCollider'});
        this.sensor = Bodies.circle(x, y, sensorRadius, {isSensor: true, label:'monsterSensor'});
        const compoundBody = Body.create({parts:[this.collider, this.sensor], frictionAir: .35});
        
        this.sprite.setExistingBody(compoundBody);
        this.sprite.setFixedRotation();

        this.speed = 1; // Default speed
        this.target = null; // Target to move towards

        scene.monsters = scene.monsters || []; // Initialize the array if it doesn't exist
        scene.monsters.push(this); // Add this monster to the array
    }

    update() {
        if (this.target) {
            this.moveTo(this.target.x, this.target.y);
            if (Phaser.Physics.Matter.Matter.Vector.magnitude(
                Phaser.Physics.Matter.Matter.Vector.sub(
                    this.target, 
                    {x: this.sprite.x, y: this.sprite.y})) < 10) {
                this.target = null;
            }
        }
        this.updateAnimation();
    }

    setTarget(x, y) {
        if (x === null && y === null) {
            this.sprite.setVelocity(0, 0); // Stop moving
            this.target = null;
        } else {
            this.target = {x, y};
        }
    }
    
    moveTo(x, y) {
        if (this.target) {
            let dirVec = Phaser.Physics.Matter.Matter.Vector.sub({x, y}, {x: this.sprite.x, y: this.sprite.y});
            let dirVecNormalized = Phaser.Physics.Matter.Matter.Vector.normalise(dirVec);
            let velocity = Phaser.Physics.Matter.Matter.Vector.mult(dirVecNormalized, this.speed);
            this.sprite.setVelocity(velocity.x, velocity.y);
        } else {
            this.sprite.setVelocity(0, 0); // Stop moving
        }
    }

    updateAnimation() {
        if (this.sprite.body.velocity.x !== 0 || this.sprite.body.velocity.y !== 0) {
            this.sprite.anims.play(`bear_walk`, true);
        } else {
            this.sprite.anims.play(`bear_idle`, true);
        }
    }

}


export class Bear extends Monster {
    constructor(scene, x, y, key = 'enemies', frame) {
        super(scene, x, y, key, frame, 47, 35, {radius: [18, 21, 20, 12]}, 75, 0.75); 
        this.sprite.play('bear_idle'); 
        this.speed = 1;
    }

    update() {
        super.update();
    }
}

export class Ent extends Monster {
    constructor(scene, x, y, key = 'enemies', frame) {
        super(scene, x, y, key, frame, 20, 45, {radius: [7, 7, 7, 7]}, 60, 0.85);  
        this.sprite.play('ent_idle');
        this.speed = 1; 
    }

    update() {
        super.update();
    }
}