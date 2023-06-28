import MainScene from "./MainScene.js";

const config = {
  width:640,
  height:640,
  backgroundColor: '#70491d',
  type: Phaser.AUTO,
  parent: 'configs',
  scene:[MainScene],
  scale: {zoom:1.4},
  physics: {default: 'matter', matter: {debug:true, gravity:{y:0}}},
  plugins: {scene:[{plugin: PhaserMatterCollisionPlugin.default, key: 'matterCollision', mapping: 'matterCollision'}]}
}

new Phaser.Game(config);