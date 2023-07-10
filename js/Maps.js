import Player from "./Player.js";
import {Monster, MonsterManager} from "./Monsters.js";
import Inventory from "./Inventory.js";

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
        Inventory.preload(this);
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
        this.gameState.loadPlayerState(this.player);
        //this.player.createBars();
        //this.player.updateBars();

        this.monsterManager = new MonsterManager(this, this.player);
        this.spawnMonster();

        this.inventory = new Inventory(this, this.gameState);
        this.gameState.loadInventoryState(this.inventory);
        this.inventory.drawInventorySlots(this);
        this.inventory.drawInventoryItems(this);      

        this.scene.launch('BarsTest', { player: this.player });

        let camera = this.cameras.main;
        camera.zoom = 1.4;
        camera.startFollow(this.player.sprite);
        camera.setLerp(0.1,0.1);
        camera.setBounds(0, 0, this.game.config.width,this.game.config.height);

        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            const zoomChange = 0.1;
            if (deltaY > 0) {
                this.cameras.main.zoom = Math.max(this.cameras.main.zoom - zoomChange, 1);
            } else {
                this.cameras.main.zoom = Math.min(this.cameras.main.zoom + zoomChange, 3.0);
            }
        });

        this.events.once('shutdown', this.shutdown, this);
    }
    
    spawnMonster() {}

    shutdown() {
        this.events.off('monsterDeath', this.monsterManager.spawnNewMonster, this.monsterManager);
        this.events.off('monsterDeath', this.player.gainXP, this.player);
    }

    update() {
        this.player.update();
        //right now for toggling the inventory visibility
        this.inventory.update();
        this.monsterManager.monsters.forEach((monster) => monster.update(this.player));
    }
}


export class Map1 extends Map {
    constructor(gameState) {
        super("Map1", gameState);
    }

    spawnMonster() {
        this.monsterManager.spawnMonster('bear');
        this.monsterManager.spawnMonster('bear');
        this.monsterManager.spawnMonster('ent');
        this.monsterManager.spawnMonster('ent');
    }

    update() {
        super.update();
        if (this.player.sprite.x > this.sys.game.config.width) {
          this.gameState.savePlayerState(this.player);
          this.gameState.saveInventoryState(this.inventory);
          this.gameState.playerPosition.x = 0;
          this.scene.start('Map2');
        }
    }
}

export class Map2 extends Map {
    constructor(gameState) {
        super("Map2", gameState);
    }

    spawnMonster() {
        this.monsterManager.spawnMonster('bear');
        this.monsterManager.spawnMonster('bear');
        this.monsterManager.spawnMonster('ent');
        this.monsterManager.spawnMonster('ent');
    }

    update() {
        super.update();
        if (this.player.sprite.x < 0) {
          this.gameState.savePlayerState(this.player);
          this.gameState.saveInventoryState(this.inventory);
          this.gameState.playerPosition.x = this.sys.game.config.width;
          this.scene.start('Map1');
        }
    }
}