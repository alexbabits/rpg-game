import GameState from './GameState.js';
import { Map1, Map2 } from "./Maps.js";
import HomeScene from "./HomeScene.js";
import GameOverScene from "./GameOverScene.js";
import EquipmentDisplay from "./EquipmentDisplay.js";
import InventoryDisplay from "./InventoryDisplay.js";
import LootDisplay from "./LootDisplay.js";
import PlayerStatusBars from "./PlayerStatusBars.js";
import Menu, { Controls } from "./Menu.js";

const gameState = new GameState();
const config = {
  width: 640,
  height: 640,
  backgroundColor: '#000',
  type: Phaser.AUTO,
  parent: 'configs',
  scene:[HomeScene, new Map1(gameState), new Map2(gameState), LootDisplay, EquipmentDisplay, InventoryDisplay, PlayerStatusBars, GameOverScene, Menu, Controls],
  scale: {zoom:1},
  physics: {default: 'matter', matter: {debug:true, gravity:{y:0}}},
  plugins: {scene:[{plugin: PhaserMatterCollisionPlugin.default, key: 'matterCollision', mapping: 'matterCollision'}]}
}

new Phaser.Game(config);