import Player from "./Player.js";
import {Monster, MonsterManager} from "./Monsters.js";

export default class Map extends Phaser.Scene {
    constructor(mapKey, gameState) {
        super(mapKey);
        this.mapKey = mapKey;
        this.gameState = gameState;
    }

    preload() {
        this.load.image('tiles', 'assets/images/RPG Nature Tileset.png');
        this.load.tilemapTiledJSON(this.mapKey, `assets/images/${this.mapKey}.json`);

        Player.preload(this);
        Monster.preload(this);
    }

    create() {
        const map = this.make.tilemap({key: this.mapKey});
        const tileset = map.addTilesetImage('RPG Nature Tileset', 'tiles', 32, 32, 0, 2);
        const background = map.createStaticLayer('background', tileset, 0, 0);
        const environment = map.createStaticLayer('environment', tileset, 0, 0);
        background.setDepth(0);
        environment.setDepth(10);
        background.setCollisionByProperty({collides:true});
        environment.setCollisionByProperty({collides:true});
        this.matter.world.convertTilemapLayer(background);
        this.matter.world.convertTilemapLayer(environment);

        this.player = new Player(this, 320, 320, this.gameState);
        this.monsterManager = new MonsterManager(this, this.player);

        this.spawnMonsters();
        
        let camera = this.cameras.main;
        camera.zoom = 1.4;
        camera.startFollow(this.player.sprite);
        camera.setLerp(0.1,0.1);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            const zoomChange = 0.1;
            if (deltaY > 0) {
                this.cameras.main.zoom = Math.max(this.cameras.main.zoom - zoomChange, 1);
            } else {
                this.cameras.main.zoom = Math.min(this.cameras.main.zoom + zoomChange, 3.0);
            }
        });
    }
    
    spawnMonsters() {}

    update() {
        this.player.update();
        this.monsterManager.monsters.forEach((monster) => monster.update(this.player));
    }
}


export class Map1 extends Map {
    constructor(gameState) {
        super("Map1", gameState);
    }

    spawnMonsters() {
        this.monsterManager.spawnMonster('bear', 50, 500, 50, 1, 2, Phaser.Math.Between(100, 500), Phaser.Math.Between(100, 300), 'enemies', undefined, 47, 35, {radius: [18, 21, 20, 12]}, 75, 30, 0.75, 'bear_idle', 'bear_walk');
        this.monsterManager.spawnMonster('bear', 50, 500, 50, 1, 2, Phaser.Math.Between(100, 500), Phaser.Math.Between(100, 300), 'enemies', undefined, 47, 35, {radius: [18, 21, 20, 12]}, 75, 30, 0.75, 'bear_idle', 'bear_walk');
        this.monsterManager.spawnMonster('ent', 30, 200, 30, 0.5, 1, Phaser.Math.Between(100, 500), Phaser.Math.Between(100, 300), 'enemies', undefined, 20, 45, {radius: [7, 7, 7, 7]}, 60, 25, 0.85, 'ent_idle', 'ent_walk');
        this.monsterManager.spawnMonster('ent', 30, 200, 30, 0.5, 1, Phaser.Math.Between(100, 500), Phaser.Math.Between(100, 300), 'enemies', undefined, 20, 45, {radius: [7, 7, 7, 7]}, 60, 25, 0.85, 'ent_idle', 'ent_walk');
    }

    update() {
        super.update();
        if (this.player.sprite.x > this.sys.game.config.width) {
            this.scene.start('Map2');
        }
    }
}

export class Map2 extends Map {
    constructor(gameState) {
        super("Map2", gameState);
    }

    spawnMonsters() {
        this.monsterManager.spawnMonster('bear', 50, 500, 50, 1, 2, Phaser.Math.Between(100, 500), Phaser.Math.Between(100, 300), 'enemies', undefined, 47, 35, {radius: [18, 21, 20, 12]}, 75, 30, 0.75, 'bear_idle', 'bear_walk');
        this.monsterManager.spawnMonster('bear', 50, 500, 50, 1, 2, Phaser.Math.Between(100, 500), Phaser.Math.Between(100, 300), 'enemies', undefined, 47, 35, {radius: [18, 21, 20, 12]}, 75, 30, 0.75, 'bear_idle', 'bear_walk');
        this.monsterManager.spawnMonster('ent', 30, 200, 30, 0.5, 1, Phaser.Math.Between(100, 500), Phaser.Math.Between(100, 300), 'enemies', undefined, 20, 45, {radius: [7, 7, 7, 7]}, 60, 25, 0.85, 'ent_idle', 'ent_walk');
        this.monsterManager.spawnMonster('ent', 30, 200, 30, 0.5, 1, Phaser.Math.Between(100, 500), Phaser.Math.Between(100, 300), 'enemies', undefined, 20, 45, {radius: [7, 7, 7, 7]}, 60, 25, 0.85, 'ent_idle', 'ent_walk');
    }

    update() {
        super.update();
        if (this.player.sprite.x < 0) {
            this.scene.start('Map1');
        }
    }
}