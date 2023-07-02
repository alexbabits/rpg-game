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
        environment.setDepth(10);
        background.setCollisionByProperty({collides:true});
        environment.setCollisionByProperty({collides:true});

        this.matter.world.convertTilemapLayer(background);
        this.matter.world.convertTilemapLayer(environment);
        this.player = new Player(this, 320, 320);
        this.monsters = [];
        this.monsters.push(new Bear(this, this.player, 320, 220));
        this.monsters.push(new Bear(this, this.player, 420, 220));
        this.monsters.push(new Ent(this, this.player, 320, 120));
        this.monsters.push(new Ent(this, this.player, 120, 120));
        
        let camera = this.cameras.main;
        camera.zoom = 1.4;
        camera.startFollow(this.player.sprite);
        camera.setLerp(0.1,0.1);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    }

    update() {
        this.player.update();
        this.monsters.forEach((monster) => monster.update(this.player));

        if (this.player.sprite.x > this.sys.game.config.width) {
            this.scene.start('Map2');
        }
    }

}