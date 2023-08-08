export default class BootScene extends Phaser.Scene {
    constructor() {
      super('BootScene');
    }
    preload() { 
        this.load.image('StartScreen', 'assets/images/StartScreen.png');
        this.load.image('purplebackground','assets/images/purplebackground.png');
        this.load.image('cursor', 'assets/images/cursor.png');
        this.load.spritesheet('items','assets/images/items.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('DeathScene', 'assets/images/DeathScene.png');
        this.load.image('brownbackground','assets/images/brownbackground.png');
        this.load.bitmapFont('Font', 'assets/images/Font.png', 'assets/images/Font.fnt');
        this.load.atlas('levelup', 'assets/images/levelup.png', 'assets/images/levelup_atlas.json');
        this.load.animation('levelupAnim', 'assets/images/levelup_anim.json');
        this.load.atlas('hero', 'assets/images/hero.png', 'assets/images/hero_atlas.json');
        this.load.animation('hero_anims', 'assets/images/hero_anims.json');
        this.load.atlas('enemies', 'assets/images/enemies.png', 'assets/images/enemies_atlas.json');
        this.load.animation('enemies_anims', 'assets/images/enemies_anims.json');
        this.load.atlas('teleporter', 'assets/images/teleporter.png', 'assets/images/teleporter_atlas.json');
        this.load.animation('teleporter_anim', 'assets/images/teleporter_anim.json');
        this.load.image('tiles', 'assets/images/RPG Nature Tileset.png');
        this.load.tilemapTiledJSON('Map1', 'assets/images/Map1.json');
        this.load.tilemapTiledJSON('Map2', 'assets/images/Map2.json');

        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics().fillStyle(0xcbdbfc, 1).fillRect(w / 4, h / 2 - 30, w / 2, 50);
        const background = this.add.graphics().fillStyle(0x45283c).fillRect(0, 0, w, h).setDepth(-1);

        let loadingText = this.make.text({x: w / 2, y: h / 2 - 70, text: 'Loading', style: {font: '48px monospace', fill: '#cbdbfc'}}).setOrigin(0.5, 0.5);
        let percentText = this.make.text({x: w / 2, y: (h / 2) - 3, text: '0%', style: {font: '24px monospace', fill: '#45283c'}}).setOrigin(0.5, 0.5).setDepth(3);
        let assetText = this.make.text({x: w / 2, y: h / 2 + 50, text: '', style: {font: '18px monospace', fill: '#cbdbfc'}}).setOrigin(0.5, 0.5).setDepth(3);

        this.load.on('progress', (value) => {
          percentText.setText(parseInt(value * 100) + '%');
          progressBar.clear();
          progressBar.fillStyle(0x847e87, 1).setDepth(2);
          progressBar.fillRect(w / 4 , h / 2 - 30, (w / 2) * value, 50);
        });
    
        this.load.on('fileprogress', (file) => {
          assetText.setText('Loading asset: ' + file.key);
        });
      } 
    
      create() {
          this.scene.stop('BootScene');
          this.scene.start('StartScreen');
    }
}