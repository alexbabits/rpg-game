import LootData from './LootData.js'

export class MonsterState {
    constructor(monster) {this.monster = monster}
    enter() {}
    update() {}
    exit() {}
}

export class MonsterIdleState extends MonsterState {
    enter() {
        console.log(`${this.monster.name} entered idle state`);
        this.monster.sprite.play(this.monster.idleAnim);
        this.monster.sprite.setVelocity(0, 0);
        this.monster.hpBar.hideHPBar();
    }
}

export class MonsterAggressiveState extends MonsterState {
    enter() {
        console.log(`${this.monster.name} entered aggressive state`);
        this.monster.sprite.play(this.monster.walkAnim);
        this.monster.hpBar.showHPBar();
    }

    update(player) {
        if(player.gameState.getPlayerHP() <= 0) {
            this.monster.transitionToNewState(this.monster.idleState);
            return;
        }
        let distance = Phaser.Math.Distance.Between(this.monster.sprite.x, this.monster.sprite.y, player.sprite.x, player.sprite.y);
        if(distance > 200) {
            this.monster.transitionToNewState(this.monster.idleState);
        } else {
            let velocity = Phaser.Physics.Matter.Matter.Vector.sub(player.sprite.body.position, this.monster.sprite.body.position);
            velocity = Phaser.Physics.Matter.Matter.Vector.normalise(velocity);
            velocity = Phaser.Physics.Matter.Matter.Vector.mult(velocity, this.monster.movementSpeed);
            this.monster.sprite.setVelocity(velocity.x, velocity.y);
            if (velocity.x < 0) {
                this.monster.sprite.setFlipX(true);
            } else if (velocity.x > 0) {
                this.monster.sprite.setFlipX(false);
            }
        }
    }
    exit(){}
}

export class MonsterAttackingState extends MonsterState {
    enter() {
        console.log(`${this.monster.name} entered attacking state (idle anim atm)`);
        this.monster.sprite.setVelocity(0, 0);
        this.monster.sprite.play(this.monster.idleAnim);
        this.attackTimer = this.monster.scene.time.now;
        this.firstAttack = true;
    }

    update(player) {
        if(player.gameState.getPlayerHP() <= 0) {
            this.monster.transitionToNewState(this.monster.idleState);
            return;
        }

        //fixes attack state bug with multiple monsters (collision end wasn't working properly)
        let distance = Phaser.Math.Distance.Between(this.monster.sprite.x, this.monster.sprite.y, player.sprite.x, player.sprite.y);
        if (distance > this.monster.attackingSensorRadius+20) {
            if(distance > this.monster.aggressionSensorRadius+20){
                this.monster.transitionToNewState(this.monster.idleState);
            } else {
                this.monster.transitionToNewState(this.monster.aggressiveState);
            }
            return;
        }

        let attackSpeed = this.firstAttack ? this.monster.attackSpeed / 4 : this.monster.attackSpeed;
        let netDamage = Math.max(0, this.monster.Damage - player.gameState.getPlayerDefense());

        if (this.monster.scene.time.now - this.attackTimer > (1000 * attackSpeed)) {
            player.gameState.setPlayerHP(player.gameState.getPlayerHP() - netDamage);
            console.log(`${this.monster.name} attacked the player for ${netDamage} Damage. Player health: ${player.gameState.getPlayerHP()}`);
            this.attackTimer = this.monster.scene.time.now;
            this.monster.attackCooldown = this.monster.scene.time.now + (1000 * this.monster.attackSpeed);
            this.firstAttack = false;

            if(player.gameState.getPlayerHP() > 0) {
                player.transitionToNewState(player.gotHitState);
            } else {
                player.transitionToNewState(player.deathState);
            }
        }
    }

    exit() {
        this.firstAttack = false;
        this.attackTimer = null;
    }
}

export class MonsterDeathState extends MonsterState {
    enter() {
        console.log(`${this.monster.name} died.`);

        let loot = new LootData();
        this.monster.scene.scene.launch('LootDisplay', { loot: loot });

        this.monster.scene.events.emit('monsterDeath', this.monster);
        this.monster.scene.matter.world.remove(this.monster.sprite.body);
        this.monster.sprite.destroy();
    }
    update() {
        return;
    }
}