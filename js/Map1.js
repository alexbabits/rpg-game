import Player from "./Player.js";
import {Monster, Bear, Ent} from "./Monsters.js";

export default class Map1 extends Phaser.Scene {
    constructor() {
        super("Map1");
    }

    preload() {
        this.load.image('tiles', 'assets/images/RPG Nature Tileset.png');
        this.load.tilemapTiledJSON('map','assets/images/map.json');

        Player.preload(this);
        Monster.preload(this);
    }

    create() {
        const map = this.make.tilemap({key: 'map'});
        const tileset = map.addTilesetImage('RPG Nature Tileset', 'tiles', 32, 32, 0, 2);
        const background = map.createStaticLayer('background', tileset, 0, 0);
        const environment = map.createStaticLayer('environment', tileset, 0, 0);
        background.setDepth(0);
        environment.setDepth(2);
        background.setCollisionByProperty({collides:true});
        environment.setCollisionByProperty({collides:true});

        this.matter.world.convertTilemapLayer(background);
        this.matter.world.convertTilemapLayer(environment);

        this.player = new Player(this, 320, 320);
        this.bear = new Bear(this, 320, 220);
        this.ent = new Ent(this, 320, 120);
        
        let camera = this.cameras.main;
        camera.zoom = 1.4;
        camera.startFollow(this.player.sprite);
        camera.setLerp(0.1,0.1);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.matter.world.on('collisionactive', (event) => {
            for (let pair of event.pairs) {
                // Check if the player is involved in the collision
                if (pair.bodyA === this.player.playerCollider || pair.bodyB === this.player.playerCollider) {
                    // If the player is colliding with a monster's sensor
                    if (pair.bodyA.label === 'monsterSensor' || pair.bodyB.label === 'monsterSensor') {
                        // Find the monster that owns this sensor
                        let monster = this.monsters.find(m => m.sensor === pair.bodyA || m.sensor === pair.bodyB);
                        if (monster) {
                            let distance = Phaser.Physics.Matter.Matter.Vector.magnitude(
                                Phaser.Physics.Matter.Matter.Vector.sub(
                                    {x: this.player.sprite.x, y: this.player.sprite.y},
                                    {x: monster.sprite.x, y: monster.sprite.y}));
        
                            if (distance <= 200) { // If the player is within 200 pixels of the monster
                                monster.setTarget(this.player.sprite.x, this.player.sprite.y); // Continuously update the target's position
                            } else { // If the player is more than 200 pixels away from the monster
                                monster.setTarget(null); // Lose the target
                            }
                        }
                    }
                }
            }
        });

    }

    update() {
        this.player.update();
        this.bear.update();
        this.ent.update();

        if (this.player.sprite.x > this.sys.game.config.width) {
            this.scene.start('Map2');
        }
    }

}