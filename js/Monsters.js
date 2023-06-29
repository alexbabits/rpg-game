export class Monster {
    static preload(scene) {
        scene.load.atlas('enemies', 'assets/images/enemies.png', 'assets/images/enemies_atlas.json');
        scene.load.animation('enemies_anims', 'assets/images/enemies_anims.json');
    }
    
    constructor(scene, x, y, key, frame, colliderWidth, colliderHeight, chamfer, sensorRadius, scale) {
        this.scene = scene;
        this.sprite = this.scene.matter.add.sprite(x, y, key, frame).setDepth(1).setScale(scale);
        // Add common properties here, such as health, speed, etc.
        // this.health = 100;
        // this.speed = 10;
        
        const {Body,Bodies} = Phaser.Physics.Matter.Matter;

        this.collider = Bodies.rectangle(x, y, colliderWidth, colliderHeight, {chamfer: chamfer, isSensor: false, label:'monsterCollider'});
        this.sensor = Bodies.circle(x, y, sensorRadius, {isSensor: true, label:'monsterSensor'});
        const compoundBody = Body.create({parts:[this.collider, this.sensor], frictionAir: .35});
        
        this.sprite.setExistingBody(compoundBody);
        this.sprite.setFixedRotation();
    }

    update() {
        // Common update logic goes here
    }
}


export class Bear extends Monster {
    constructor(scene, x, y, key = 'enemies', frame) {
        super(scene, x, y, key, frame, 47, 35, {radius: [18, 21, 20, 12]}, 75, 0.75); 
        this.sprite.play('bear_idle'); 
        // Add bear-specific properties here, such as attack strength, etc.
        // this.attackStrength = 20;
    }

    update() {
        super.update();
        // Bear-specific update logic goes here
    }
}

export class Ent extends Monster {
    constructor(scene, x, y, key = 'enemies', frame) {
        super(scene, x, y, key, frame, 20, 45, {radius: [7, 7, 7, 7]}, 60, 0.85);  
        this.sprite.play('ent_idle'); 
        // Add ent-specific properties here, such as attack strength, etc.
        // this.attackStrength = 15;
    }

    update() {
        super.update();
        // Ent-specific update logic goes here
    }
}