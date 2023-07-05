import GameState from './GameState.js';
import { Map1, Map2 } from "./Maps.js";
import HomeScene from "./HomeScene.js";
import GameOverScene from "./GameOverScene.js";

const gameState = new GameState();

const config = {
  width:640,
  height:640,
  backgroundColor: '#000000',
  type: Phaser.AUTO,
  parent: 'configs',
  scene:[HomeScene, new Map1(gameState), new Map2(gameState), GameOverScene],
  scale: {zoom:1.4},
  physics: {default: 'matter', matter: {debug:true, gravity:{y:0}}},
  plugins: {scene:[{plugin: PhaserMatterCollisionPlugin.default, key: 'matterCollision', mapping: 'matterCollision'}]}
}

const game = new Phaser.Game(config);