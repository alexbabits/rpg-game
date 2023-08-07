import GameState from './GameState.js';
import { Map1, Map2 } from "./Maps.js";
import StartScreen from "./StartScreen.js";
import DeathScene from "./DeathScene.js";
import EquipmentDisplay from "./EquipmentDisplay.js";
import InventoryDisplay from "./InventoryDisplay.js";
import LootDisplay from "./LootDisplay.js";
import PlayerVisualScene from "./PlayerVisualScene.js";
import Menu from "./Menu.js";
import Journal from "./Journal.js"
import MessageBox from "./MessageBox.js"
import Talents from "./Talents.js"
import LoadScene from "./LoadScene.js";
import OptionsScene from "./OptionsScene.js"
import BootScene from "./BootScene.js"
import WorldMap from "./WorldMap.js"

const gameState = new GameState();
const config = {
  width: 640, //window.innerWidth in the future?
  height: 640, //window.innerHeight in the future?
  backgroundColor: '#000',
  type: Phaser.AUTO,
  parent: 'configs',
  scene:[BootScene, new StartScreen(gameState), new Map1(gameState), new Map2(gameState), LootDisplay, EquipmentDisplay, InventoryDisplay, PlayerVisualScene, DeathScene, Menu, Journal, WorldMap, MessageBox, Talents, OptionsScene, new LoadScene(gameState)],
  scale: {zoom:1},
  physics: {default: 'matter', matter: {debug:true, gravity:{y:0}}},
  plugins: {scene:[{plugin: PhaserMatterCollisionPlugin.default, key: 'matterCollision', mapping: 'matterCollision'}]}
}

new Phaser.Game(config);