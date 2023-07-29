import GameState from './GameState.js';
import { Map1, Map2 } from "./Maps.js";
import StartScreen from "./StartScreen.js";
import DeathScene from "./DeathScene.js";
import EquipmentDisplay from "./EquipmentDisplay.js";
import InventoryDisplay from "./InventoryDisplay.js";
import LootDisplay from "./LootDisplay.js";
import PlayerStatusBars from "./PlayerStatusBars.js";
import Menu from "./Menu.js";
import LoadScene from "./LoadScene.js";
import ControlsScene from "./ControlsScene.js"

const gameState = new GameState();
const config = {
  width: 640,
  height: 640,
  backgroundColor: '#000',
  type: Phaser.AUTO,
  parent: 'configs',
  scene:[new StartScreen(gameState), new Map1(gameState), new Map2(gameState), LootDisplay, EquipmentDisplay, InventoryDisplay, PlayerStatusBars, DeathScene, Menu, ControlsScene, new LoadScene(gameState)],
  scale: {zoom:1},
  physics: {default: 'matter', matter: {debug:true, gravity:{y:0}}},
  plugins: {scene:[{plugin: PhaserMatterCollisionPlugin.default, key: 'matterCollision', mapping: 'matterCollision'}]}
}

new Phaser.Game(config);