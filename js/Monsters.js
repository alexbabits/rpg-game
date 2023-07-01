import { MonsterState, MonsterIdleState, MonsterAggressiveState, MonsterAttackingState } from "./MonsterState.js";

export class Monster {

    static preload(scene) {
        scene.load.atlas('enemies', 'assets/images/enemies.png', 'assets/images/enemies_atlas.json');
        scene.load.animation('enemies_anims', 'assets/images/enemies_anims.json');
    }
    
    constructor(name, damage, scene, player, x, y, key, frame, colliderWidth, colliderHeight, chamfer, aggressionSensorRadius, attackingSensorRadius, scale, speed, idleAnim, walkAnim) {
        this.name = name;
        this.damage = damage;
        this.scene = scene;
        this.player = player;
        this.speed = speed;
        this.idleAnim = idleAnim;
        this.walkAnim = walkAnim;
        this.sprite = this.scene.matter.add.sprite(x, y, key, frame).setDepth(1).setScale(scale);
        const {Body,Bodies} = Phaser.Physics.Matter.Matter;
        this.collider = Bodies.rectangle(x, y, colliderWidth, colliderHeight, {chamfer: chamfer, isSensor: false, label:'monsterCollider', parent: this});
        this.aggressionSensor = Bodies.circle(x, y, aggressionSensorRadius, {isSensor: true, label:'monsterAggressionSensor', parent: this});
        this.attackingSensor = Bodies.circle(x, y, attackingSensorRadius, {isSensor: true, label:'monsterAttackingSensor', parent: this});
        const compoundBody = Body.create({parts:[this.collider, this.aggressionSensor, this.attackingSensor], frictionAir: .35}); 
        this.sprite.setExistingBody(compoundBody);
        this.sprite.setFixedRotation();


        this.scene.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
            if(bodyA.label === 'playerCollider' && bodyB.parent === this.sprite.body) {
                if(bodyB.label === 'monsterAggressionSensor') {
                    this.transition(new MonsterAggressiveState(this));
                } else if(bodyB.label === 'monsterAttackingSensor') {
                    this.transition(new MonsterAttackingState(this));
                }
            }
        });

        this.scene.matter.world.on('collisionend', (event, bodyA, bodyB) => {
            if(bodyA.label === 'playerCollider' && bodyB.parent === this.sprite.body) {
                if(bodyB.label === 'monsterAttackingSensor') {
                    this.transition(new MonsterAggressiveState(this));
                }
            }
        });

        this.currentState = new MonsterIdleState(this);
    }

    transition(newState) {
        this.currentState.exit();
        this.currentState = newState;
        this.currentState.enter();
    }

    update(player) {
        this.currentState.execute(player);
    }
}


export class Bear extends Monster {
    constructor(scene, player, x, y, key = 'enemies', frame) {
        super('bear', 5, scene, player, x, y, key, frame, 47, 35, {radius: [18, 21, 20, 12]}, 75, 40, 0.75, 1, 'bear_idle', 'bear_walk'); 
        this.sprite.play('bear_idle'); 
    }
}

export class Ent extends Monster {
    constructor(scene, player, x, y, key = 'enemies', frame) {
        super('ent', 3, scene, player, x, y, key, frame, 20, 45, {radius: [7, 7, 7, 7]}, 60, 35, 0.85, 0.5, 'ent_idle', 'ent_walk');  
        this.sprite.play('ent_idle');
    }
}