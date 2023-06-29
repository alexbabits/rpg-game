import Player from "./Player.js";
import {Monster, Bear, Ent} from "./Monsters.js";

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
        environment.setDepth(2);
        background.setCollisionByProperty({collides:true});
        environment.setCollisionByProperty({collides:true});

        this.matter.world.convertTilemapLayer(background);
        this.matter.world.convertTilemapLayer(environment);

        this.player = new Player(this, 160, 160);
        this.bear = new Bear(this, 200, 280);
        this.ent = new Ent(this, 360, 120);
        
        let camera = this.cameras.main;
        camera.zoom = 1.4;
        camera.startFollow(this.player.sprite);
        camera.setLerp(0.1,0.1);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }

    update() {
        this.player.update();
        this.bear.update();
        this.ent.update();

        if (this.player.sprite.x < 0) {
            this.scene.start('Map1');
        }
    }
}