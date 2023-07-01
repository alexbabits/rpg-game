export class MonsterState {
    constructor(monster) {this.monster = monster}
    enter() {}
    update() {}
    exit() {}
}

export class MonsterIdleState extends MonsterState {
    enter() {
        console.log(`${this.monster.name} is passively idling`);
        this.monster.sprite.play(this.monster.idleAnim);
        this.monster.sprite.setVelocity(0, 0);
    }
}

export class MonsterAggressiveState extends MonsterState {
    enter() {
        console.log(`${this.monster.name} is aggressive and walking towards the player`);
        this.monster.sprite.play(this.monster.walkAnim);
    }

    update(player) {
        let distance = Phaser.Math.Distance.Between(this.monster.sprite.x, this.monster.sprite.y, player.sprite.x, player.sprite.y);
        if(distance > 200) {
            this.monster.transitionStates(new MonsterIdleState(this.monster));
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
}

export class MonsterAttackingState extends MonsterState {
    enter() {
        console.log(`${this.monster.name} is attacking the player with idle animation`);
        this.monster.sprite.play(this.monster.idleAnim);
        this.monster.sprite.setVelocity(0, 0);
        this.attackTimer = this.monster.scene.time.now;
    }

    update(player) {
        if (this.monster.scene.time.now - this.attackTimer > (1000*this.monster.attackSpeed)) {
            player.HP -= this.monster.damage;
            console.log(`${this.monster.name} attacked the player for ${this.monster.damage} damage. Player health: ${player.HP}`);
            this.attackTimer = this.monster.scene.time.now;
            this.monster.scene.events.emit('playerHit', player);
        }
    }
    exit() {
        this.attackTimer = null;
    }
}