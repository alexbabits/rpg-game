export class MonsterState {
    constructor(monster) {this.monster = monster}
    enter() {}
    execute() {}
    exit() {}
}

export class MonsterIdleState extends MonsterState {
    enter() {
        this.monster.sprite.play(this.monster.idleAnim);
        this.monster.sprite.setVelocity(0, 0);
    }
    execute(player) {}
}

export class MonsterAggressiveState extends MonsterState {
    enter() {
        this.monster.sprite.play(this.monster.walkAnim);
    }

    execute(player) {
        let distance = Phaser.Math.Distance.Between(this.monster.sprite.x, this.monster.sprite.y, player.sprite.x, player.sprite.y);
        if(distance > 200) {
            this.monster.transition(new MonsterIdleState(this.monster));
        } else {
            let velocity = Phaser.Physics.Matter.Matter.Vector.sub(player.sprite.body.position, this.monster.sprite.body.position);
            velocity = Phaser.Physics.Matter.Matter.Vector.normalise(velocity);
            velocity = Phaser.Physics.Matter.Matter.Vector.mult(velocity, this.monster.speed);
            this.monster.sprite.setVelocity(velocity.x, velocity.y);
        }
    }
}

export class MonsterAttackingState extends MonsterState {
    enter() {
        this.monster.sprite.play(this.monster.idleAnim);
        this.monster.sprite.setVelocity(0, 0);
    }

    execute(player) {}
}