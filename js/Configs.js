import Map1 from "./Map1.js";
import Map2 from "./Map2.js";
import HomeScene from "./HomeScene.js";

const config = {
  width:640,
  height:640,
  backgroundColor: '#70491d',
  type: Phaser.AUTO,
  parent: 'configs',
  scene:[HomeScene, Map1, Map2],
  scale: {zoom:1.4},
  physics: {default: 'matter', matter: {debug:true, gravity:{y:0}}},
  plugins: {scene:[{plugin: PhaserMatterCollisionPlugin.default, key: 'matterCollision', mapping: 'matterCollision'}]}
}

new Phaser.Game(config);