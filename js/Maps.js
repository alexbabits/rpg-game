import Player from "./Player.js";
import InventoryData from "./InventoryData.js";
import EquipmentData from "./EquipmentData.js";
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
        this.gameState.loadPlayerState(this.player);
        this.scene.launch('PlayerStatusBars', { player: this.player });
        
        this.equipment = new EquipmentData(this, this.gameState, this.player);
        this.gameState.loadEquipmentState(this.equipment)
        this.scene.launch('EquipmentDisplay', { equipment: this.equipment});
        
        this.inventory = new InventoryData(this, this.gameState, this.player, this.equipment);
        this.gameState.loadInventoryState(this.inventory)
        this.scene.launch('InventoryDisplay', { inventory: this.inventory});
        
        this.equipment.setInventoryData(this.inventory);

        this.monsterManager = new MonsterManager(this, this.player);
        this.spawnMonster();

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.launch('Menu', { gameState: this.gameState });
            this.scene.pause();
        });

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
        this.events.off('itemLooted', this.inventory.addInvItem, this.inventory)
    }

    update() {
        this.player.update();
        this.monsterManager.monsters.forEach((monster) => monster.update(this.player));
    }
}


export class Map1 extends Map {
    constructor(gameState) {
        super("Map1", gameState);
    }

    create(){
        super.create();
        this.gameState.setCurrentMap('Map1');
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
          this.gameState.saveEquipmentState(this.equipment);
          this.gameState.playerPosition.x = 0;
          this.scene.start('Map2');
        }
    }
}

export class Map2 extends Map {
    constructor(gameState) {
        super("Map2", gameState);
    }

    create(){
        super.create();
        this.gameState.setCurrentMap('Map2');
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
          this.gameState.saveEquipmentState(this.equipment);
          this.gameState.playerPosition.x = this.sys.game.config.width;
          this.scene.start('Map1');
        }
    }
}