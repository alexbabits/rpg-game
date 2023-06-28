import Player from "./Player.js";
import {Monster, Bear, Ent} from "./Monsters.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("mainScene");
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

        this.anims.fromJSON(this.cache.json.get('enemies_anims'));
        
        this.player = new Player(this, 320, 320);
        this.bear = new Bear(this, 320, 220);
        this.ent = new Ent(this, 320, 120);
        console.log(this.player);
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
    }
}

