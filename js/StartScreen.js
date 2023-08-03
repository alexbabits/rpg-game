export default class StartScreen extends Phaser.Scene {
    constructor(gameState) {
        super("StartScreen");
        this.gameState = gameState;
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
        this.load.image('tiles', 'assets/images/RPG Nature Tileset.png');
        this.load.tilemapTiledJSON('Map1', 'assets/images/Map1.json');
        this.load.tilemapTiledJSON('Map2', 'assets/images/Map2.json');
    }

    create() {
        this.add.image(0, 0, 'StartScreen').setOrigin(0).setScale(1);
        this.input.setDefaultCursor(`url(assets/images/cursor.png), pointer`);
        this.createButtons();
    }

    createButtons() {
        const labels = ['New', 'Load', 'Options', 'Quit'];
        const yPos = [420, 480, 540, 600];

        labels.forEach((label, index) => {
            let buttonClickedMethod;
            const y = yPos[index];
            const buttonRectangle = this.add.rectangle(320, y, 200, 50, 0xcbdbfc).setInteractive();
            buttonRectangle.on('pointerover', () => buttonRectangle.setFillStyle(0xa3bffa));
            buttonRectangle.on('pointerout', () => buttonRectangle.setFillStyle(0xcbdbfc));
            
            if (label === 'New') {buttonClickedMethod = this.newButtonClicked.bind(this)}
            else if (label === 'Load') {buttonClickedMethod = this.loadButtonClicked.bind(this)} 
            else if (label === 'Options') {buttonClickedMethod = this.optionsButtonClicked.bind(this)}
            else if (label === 'Quit') { buttonClickedMethod = this.quitButtonClicked.bind(this)}

            buttonRectangle.on('pointerdown', buttonClickedMethod);

            const buttonText = this.add.text(320, y, label, { fontSize: '24px', fontFamily: 'Arial', fill: '#452840', resolution: 4 }).setOrigin(0.5, 0.5);
            this.add.container(0, 0, [buttonRectangle, buttonText]);
        });
    }

    newButtonClicked(){
        this.scene.stop('StartScreen');
        this.gameState.playerState = null;
        this.gameState.inventoryState = null;
        this.gameState.equipmentState = null;
        this.gameState.currentMap = null;
        this.gameState.playerPosition = {x: 320, y: 320};
        this.gameState.playerDirection = 'Right';
        this.player = null;
        this.inventory = null;
        this.equipment = null;
        this.scene.start('Map1');
    }
    
    loadButtonClicked(){
        this.scene.stop('StartScreen');
        this.scene.start('LoadScene', { returnScene: this.scene.key });
    }

    optionsButtonClicked(){
        for (let key in this.scene.manager.scenes) {
            if (key !== 'ControlsScene') {
                this.scene.manager.scenes[key].scene.stop();
            }
        }
        this.scene.start('ControlsScene', { returnScene: this.scene.key });
    }

    quitButtonClicked() {
        window.electron.quitApp();
    }

}