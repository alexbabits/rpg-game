import Player from "./Player.js";
import {Monster, MonsterManager} from "./Monsters.js";

export default class Map2 extends Phaser.Scene {
    constructor() {
        super("Map2");
    }

    preload() {
        this.load.image('tiles', 'assets/images/RPG Nature Tileset.png');
        this.load.tilemapTiledJSON('map2','assets/images/map2.json');

        Player.preload(this);
        Monster.preload(this);
    }

    create() {
        const map = this.make.tilemap({key: 'map2'});
        const tileset = map.addTilesetImage('RPG Nature Tileset', 'tiles', 32, 32, 0, 2);
        const background = map.createStaticLayer('background', tileset, 0, 0);
        const environment = map.createStaticLayer('environment', tileset, 0, 0);
        background.setDepth(0);
        environment.setDepth(10);
        background.setCollisionByProperty({collides:true});
        environment.setCollisionByProperty({collides:true});
        this.matter.world.convertTilemapLayer(background);
        this.matter.world.convertTilemapLayer(environment);

        this.player = new Player(this, 320, 320);
        this.monsterManager = new MonsterManager(this, this.player);
        this.monsterManager.spawnMonster('bear', 50, 500, 50, 1, 2, 320, 220, 'enemies', undefined, 47, 35, {radius: [18, 21, 20, 12]}, 75, 30, 0.75, 'bear_idle', 'bear_walk');
        this.monsterManager.spawnMonster('bear', 50, 500, 50, 1, 2, 420, 220, 'enemies', undefined, 47, 35, {radius: [18, 21, 20, 12]}, 75, 30, 0.75, 'bear_idle', 'bear_walk');
        this.monsterManager.spawnMonster('ent', 30, 200, 30, 0.5, 1, 320, 120, 'enemies', undefined, 20, 45, {radius: [7, 7, 7, 7]}, 60, 25, 0.85, 'ent_idle', 'ent_walk');
        this.monsterManager.spawnMonster('ent', 30, 200, 30, 0.5, 1, 120, 120, 'enemies', undefined, 20, 45, {radius: [7, 7, 7, 7]}, 60, 25, 0.85, 'ent_idle', 'ent_walk');
        
        let camera = this.cameras.main;
        camera.zoom = 1.4;
        camera.startFollow(this.player.sprite);
        camera.setLerp(0.1,0.1);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }

    update() {
        this.player.update();
        this.monsterManager.monsters.forEach((monster) => monster.update(this.player));

        if (this.player.sprite.x < 0) {
            this.scene.start('Map1');
        }
    }
}