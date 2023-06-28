// Monster.js
export class Monster {

    static preload(scene) {
        scene.load.atlas('enemies', 'assets/images/enemies.png', 'assets/images/enemies_atlas.json');
        scene.load.animation('enemies_anims', 'assets/images/enemies_anims.json');
    }
    
    constructor(scene, x, y, key, frame) {
        this.scene = scene;
        this.sprite = this.scene.matter.add.sprite(x, y, key, frame);
        // Add common properties here, such as health, speed, etc.
        // this.health = 100;
        // this.speed = 10;
    }

    update() {
        // Common update logic goes here
    }
}


export class Bear extends Monster {
    constructor(scene, x, y, key = 'enemies', frame) {
        super(scene, x, y, key, frame);
        this.sprite.play('bear_idle'); // assuming this is the name of the animation
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
        super(scene, x, y, key, frame);
        this.sprite.play('ent_idle'); // assuming this is the name of the animation
        // Add ent-specific properties here, such as attack strength, etc.
        // this.attackStrength = 15;
    }

    update() {
        super.update();
        // Ent-specific update logic goes here
    }
}

