import {MonsterIdleState, MonsterAggressiveState, MonsterAttackingState, MonsterDeathState} from "./MonsterState.js";
import { MonsterHPBar } from './MonsterBars.js';

export class Monster {

    static preload(scene) {
        scene.load.atlas('enemies', 'assets/images/enemies.png', 'assets/images/enemies_atlas.json');
        scene.load.animation('enemies_anims', 'assets/images/enemies_anims.json');
    }
    
    constructor(name, XP, maxHP, HP, Damage, movementSpeed, attackSpeed, scene, player, x, y, key, frame, colliderWidth, colliderHeight, chamfer, aggressionSensorRadius, attackingSensorRadius, scale, idleAnim, walkAnim) {
        this.name = name;
        this.XP = XP;
        this.maxHP = maxHP;
        this.HP = HP;
        this.Damage = Damage;
        this.movementSpeed = movementSpeed;
        this.attackSpeed = attackSpeed;
        this.scene = scene;
        this.player = player;
        this.idleAnim = idleAnim;
        this.walkAnim = walkAnim;
        this.aggressionSensorRadius = aggressionSensorRadius;
        this.attackingSensorRadius = attackingSensorRadius;
        this.colliderWidth = colliderWidth;
        this.colliderHeight = colliderHeight;
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


        this.idleState = new MonsterIdleState(this);
        this.aggressiveState = new MonsterAggressiveState(this);
        this.attackingState = new MonsterAttackingState(this);
        this.deathState = new MonsterDeathState(this);
        this.currentState = this.idleState;

        this.hpBar = new MonsterHPBar(this.scene, this);
    }


    handleCollisionStart(event, bodyA, bodyB) {
        if(bodyA.label === 'playerCollider' && bodyB.parent === this.sprite.body) {
            if(bodyB.label === 'monsterAggressionSensor') {
                this.transitionToNewState(this.aggressiveState);
            } else if(bodyB.label === 'monsterAttackingSensor') {
                this.transitionToNewState(this.attackingState);
            }
        }
    }
    
    handleCollisionEnd(event, bodyA, bodyB) {
        if(bodyA.label === 'playerCollider' && bodyB.parent === this.sprite.body) {
            if(bodyB.label === 'monsterAttackingSensor') {
                this.transitionToNewState(this.aggressiveState);
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
            this.transitionToNewState(this.deathState);
        }
    }

    update(player) {
        this.currentState.update(player);
        this.hpBar.update();
    }
}

// super(name, XP, maxHP, HP, Damage, movementSpeed, attackSpeed, scene, player, x, y, key, frame, colliderWidth, colliderHeight, chamfer, aggressionSensorRadius, attackingSensorRadius, scale, idleAnim, walkAnim)

export class Bear extends Monster {
    constructor(scene, player, x = Phaser.Math.Between(100, 500), y = Phaser.Math.Between(100, 300)) {
        super('bear', 40, 500, 500, 50, 1, 2, scene, player, x, y, 'enemies', undefined, 47, 35, {radius: [18, 21, 20, 12]}, 75, 30, 0.75, 'bear_idle', 'bear_walk')}
}

export class Ent extends Monster {
    constructor(scene, player, x = Phaser.Math.Between(100, 500), y = Phaser.Math.Between(100, 300)) {
        super('ent', 30, 350, 350, 30, 0.5, 1.5, scene, player, x, y, 'enemies', undefined, 20, 45, {radius: [7, 7, 7, 7]}, 60, 25, 0.85, 'ent_idle', 'ent_walk')}
}


export class MonsterManager {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.monsters = [];
        this.monsterClasses = {'bear': Bear, 'ent': Ent};
        this.scene.events.on('monsterDeath', this.spawnNewMonster, this);
    }

    spawnMonster(type) {
        let monster;
        let x = Phaser.Math.Between(100, 500);
        let y = Phaser.Math.Between(100, 300);
        const MonsterClass = this.monsterClasses[type];
        if (MonsterClass) {
            monster = new MonsterClass(this.scene, this.player, x, y);
            this.monsters.push(monster);
            monster.sprite.play(`${type}_idle`);
        }
        return monster;
    }

    spawnNewMonster(deadMonster) {
        this.scene.time.addEvent({
            delay: 5000,
            callback: () => {
                this.spawnMonster(deadMonster.name);
            },
            callbackScope: this
        });
    }
}