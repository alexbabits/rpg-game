import {MonsterIdleState, MonsterAggressiveState, MonsterAttackingState, MonsterDeathState} from "./MonsterState.js";

export class Monster {

    static preload(scene) {
        scene.load.atlas('enemies', 'assets/images/enemies.png', 'assets/images/enemies_atlas.json');
        scene.load.animation('enemies_anims', 'assets/images/enemies_anims.json');
    }
    
    constructor(name, maxHP, HP, monsterDamage, movementSpeed, attackSpeed, scene, player, x, y, key, frame, colliderWidth, colliderHeight, chamfer, aggressionSensorRadius, attackingSensorRadius, scale, idleAnim, walkAnim) {
        this.name = name;
        this.maxHP = maxHP;
        this.HP = HP;
        this.monsterDamage = monsterDamage;
        this.movementSpeed = movementSpeed;
        this.attackSpeed = attackSpeed;
        this.scene = scene;
        this.player = player;
        this.idleAnim = idleAnim;
        this.walkAnim = walkAnim;
        this.aggressionSensorRadius = aggressionSensorRadius;
        this.attackingSensorRadius = attackingSensorRadius;
        this.sprite = this.scene.matter.add.sprite(x, y, key, frame).setDepth(2).setScale(scale);
        this.sprite.monsterInstance = this;

        const {Body,Bodies} = Phaser.Physics.Matter.Matter;
        this.originalChamfer = { radius: [...chamfer.radius] };
        this.collider = Bodies.rectangle(x, y, colliderWidth, colliderHeight, {chamfer: chamfer, isSensor: false, label:'monsterCollider', parent: this});
        this.aggressionSensor = Bodies.circle(x, y, aggressionSensorRadius, {isSensor: true, label:'monsterAggressionSensor', parent: this});
        this.attackingSensor = Bodies.circle(x, y, attackingSensorRadius, {isSensor: true, label:'monsterAttackingSensor', parent: this});
        const compoundBody = Body.create({parts:[this.collider, this.aggressionSensor, this.attackingSensor], frictionAir: .35}); 
        this.sprite.setExistingBody(compoundBody);
        this.sprite.setFixedRotation();

        this.scene.matter.world.on('collisionstart', this.handleCollisionStart.bind(this));
        this.scene.matter.world.on('collisionend', this.handleCollisionEnd.bind(this));
        this.currentState = new MonsterIdleState(this);
    }

    handleCollisionStart(event, bodyA, bodyB) {
        if(bodyA.label === 'playerCollider' && bodyB.parent === this.sprite.body) {
            if(bodyB.label === 'monsterAggressionSensor') {
                this.transitionToNewState(new MonsterAggressiveState(this));
            } else if(bodyB.label === 'monsterAttackingSensor') {
                this.transitionToNewState(new MonsterAttackingState(this));
            }
        }
      }
    
    handleCollisionEnd(event, bodyA, bodyB) {
        if(bodyA.label === 'playerCollider' && bodyB.parent === this.sprite.body) {
            if(bodyB.label === 'monsterAttackingSensor') {
                this.transitionToNewState(new MonsterAggressiveState(this));
            }
        }
      }

    transitionToNewState(newState) {
        this.currentState.exit();
        this.currentState = newState;
        this.currentState.enter();
    }

    handleMonsterDeath() {
        if(this.HP <= 0) {
            this.transitionToNewState(new MonsterDeathState(this));
        }
    }

    update(player) {
        this.currentState.update(player);
    }
}

/*
export class Bear extends Monster {
    constructor(scene, player, x, y, key = 'enemies', frame) {
        super('bear', 500, 500, 5, 1, 2, scene, player, x, y, key, frame, 47, 35, {radius: [18, 21, 20, 12]}, 75, 30, 0.75, 'bear_idle', 'bear_walk'); 
        this.sprite.play('bear_idle'); 
    }
}

export class Ent extends Monster {
    constructor(scene, player, x, y, key = 'enemies', frame) {
        super('ent', 200, 200, 3, 0.5, 1, scene, player, x, y, key, frame, 20, 45, {radius: [7, 7, 7, 7]}, 60, 25, 0.85, 'ent_idle', 'ent_walk');  
        this.sprite.play('ent_idle');
    }
}
*/
export class MonsterManager {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.monsters = [];
        this.scene.events.on('monsterDeath', this.spawnNewMonster, this);
    }
    //Notice the double 'maxHP', that is actually delicate and neccessary, as 'HP' of the deadmonster is technically dynamic and at 0, would need to save that somewhere else in a different fashion perhaps, to use just the 'HP'. So may need to tinker with this for the HP bars.
    // spawnNewMonster may need the 'HP' stat for the hp bars to work properly!
    spawnMonster(name, maxHP, monsterDamage, movementSpeed, attackSpeed, x, y, key, frame, colliderWidth, colliderHeight, chamfer, aggressionSensorRadius, attackingSensorRadius, scale, idleAnim, walkAnim) {
        let monster = new Monster(name, maxHP, maxHP, monsterDamage, movementSpeed, attackSpeed, this.scene, this.player, x, y, key, frame, colliderWidth, colliderHeight, chamfer, aggressionSensorRadius, attackingSensorRadius, scale, idleAnim, walkAnim);
        this.monsters.push(monster);
        monster.sprite.play(`${name}_idle`);
        return monster;
    }
    //Ask about the collider.bounds.max and min and why those are used instead of colliderWidth and colliderHeight.
    spawnNewMonster(deadMonster) {
        let x = 500;
        let y = 500;
        this.spawnMonster(deadMonster.name, deadMonster.maxHP, deadMonster.monsterDamage, deadMonster.movementSpeed, deadMonster.attackSpeed, x, y, deadMonster.sprite.texture.key, deadMonster.sprite.frame.name, deadMonster.collider.bounds.max.x - deadMonster.collider.bounds.min.x, deadMonster.collider.bounds.max.y - deadMonster.collider.bounds.min.y, deadMonster.originalChamfer, deadMonster.aggressionSensorRadius, deadMonster.attackingSensorRadius, deadMonster.sprite.scale, deadMonster.idleAnim, deadMonster.walkAnim);
    }
}