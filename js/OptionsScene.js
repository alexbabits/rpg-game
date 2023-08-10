export default class OptionsScene extends Phaser.Scene {
    constructor() {
        super("OptionsScene");
        this.contents = {};
        this.currentVisible = 'controls';
    }

    create(data) {
        this.returnScene = data.returnScene;
        this.purplebackground = this.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'purplebackground');
        this.add.rectangle(90, 320, 180, 640, 0x36454F).setOrigin(0.5,0.5)
        this.input.keyboard.on('keydown-ESC', () => this.returnToPreviousScene());

        this.createButtons();
        this.createControlsContents();
        this.createGraphicsContents();
        this.createAudioContents();
        this.toggleVisibility('controls');
    }

    createButtons() {
        const yCoords = [610, 150, 200, 250];
        const widths = [80, 100, 100, 100];
        const labels = ['Back', 'Controls', 'Graphics', 'Audio'];
        const actions = [() => this.returnToPreviousScene(), () => this.toggleVisibility('controls'), () => this.toggleVisibility('graphics'), () => this.toggleVisibility('audio')];
    
        for (let i = 0; i < labels.length; i++) {
            const buttonRectangle = this.add.rectangle(90, yCoords[i], widths[i], 40, 0xcbdbfc).setInteractive();
            this.add.text(90, yCoords[i], labels[i], { font: '22px Arial', fill: '#452840', resolution: 2 }).setOrigin(0.5, 0.5);
            buttonRectangle.on('pointerover', () => buttonRectangle.setFillStyle(0xa3bffa));
            buttonRectangle.on('pointerout', () => buttonRectangle.setFillStyle(0xcbdbfc));
            buttonRectangle.on('pointerdown', actions[i]);
        }
    }

    createControlsContents(){
        const y = [50, 110, 170, 230, 290, 350, 410, 470, 530, 590];
        const actions = ['Movement', 'Sprint', 'Attack', 'Special Attack', 'Inventory', 'Character', 'Journal', 'Message Box', 'World Map', 'Exit/Back'];
        const keys = ['WASD/UDLR', 'Shift', 'Space', 'Ctrl+Space', 'I', 'C',  'J', 'K', 'M', 'Esc'];
        this.contents['controls'] = this.add.container();
        for (let i = 0; i < actions.length; i++) {
            const actionText = this.add.text(300, y[i], actions[i], { font: '24px Arial', fill: '#cbdbfc', resolution: 2 }).setOrigin(0.5);
            this.contents['controls'].add(actionText);
        }
        for (let i = 0; i < keys.length; i++) {
            const keyText = this.add.text(520, y[i], keys[i], { font: '24px Arial', fill: '#cbdbfc', resolution: 2 }).setOrigin(0.5);
            this.contents['controls'].add(keyText);
        }
        this.contents['controls'].setVisible(true);
    }

    createGraphicsContents() {
        const y = [50, 110, 170, 230];
        const descriptions = ['Resolution', 'FullScreen', 'Borderless', 'Native Cursor'];
        const resolutions = ['1920 x 1080', '1280 x 720', '960 x 540'];
        let currentIndex = 0;
        this.contents['graphics'] = this.add.container();
    
        const resolutionText = this.add.text(520, y[0], resolutions[currentIndex], { font: '24px Arial', fill: '#cbdbfc', resolution: 2 }).setOrigin(0.5);
        this.contents['graphics'].add(resolutionText);

        const increaseTriangle = this.add.polygon(600, y[0], [0, 0, 15, 10, 0, 20], 0x000).setInteractive();
        const increaseRect = this.add.rectangle(600, y[0], 20, 25, 0xcbdbfc)
        increaseTriangle.on('pointerdown', () => {
            if (currentIndex < resolutions.length - 1) {
                currentIndex++;
                resolutionText.setText(resolutions[currentIndex]);
            }
        });
        this.contents['graphics'].add(increaseRect);
        this.contents['graphics'].add(increaseTriangle);

        const decreaseTriangle = this.add.polygon(440, y[0], [15, 0, 0, 10, 15, 20], 0x000).setInteractive();
        const decreaseRect = this.add.rectangle(440, y[0], 20, 25, 0xcbdbfc)
        decreaseTriangle.on('pointerdown', () => {
            if (currentIndex > 0) {
                currentIndex--;
                resolutionText.setText(resolutions[currentIndex]);
            }
        });
        this.contents['graphics'].add(decreaseRect);
        this.contents['graphics'].add(decreaseTriangle);
    
        for (let i = 0; i < descriptions.length; i++) {
            const descriptionsText = this.add.text(300, y[i], descriptions[i], { font: '24px Arial', fill: '#cbdbfc', resolution: 2 }).setOrigin(0.5);
            this.contents['graphics'].add(descriptionsText);
        }
    
        for (let i = 1; i < 4; i++) {
            const outerCircle = this.add.circle(520, y[i], 12, 0xcbdbfc).setInteractive();
            const innerCircle = this.add.circle(520, y[i], 7, 0x000);
            innerCircle.setVisible(false);
            outerCircle.on('pointerdown', () => innerCircle.setVisible(!innerCircle.visible));
            this.contents['graphics'].add(outerCircle);
            this.contents['graphics'].add(innerCircle);
        }
        this.contents['graphics'].setVisible(false);
    }

    createAudioContents(){
        const y = [50, 110, 170, 230];
        const descriptions = ['Master Volume', 'Music', 'SFX', 'Ambience'];
        this.contents['audio'] = this.add.container();
        for (let i = 0; i < descriptions.length; i++) {
            const descriptionsText = this.add.text(300, y[i], descriptions[i], { font: '24px Arial', fill: '#cbdbfc', resolution: 2 }).setOrigin(0.5);
            this.contents['audio'].add(descriptionsText);
    
            const bar = this.add.rectangle(500, y[i], 100, 10, 0xcbdbfc); 
            const handle = this.add.rectangle(500, y[i], 15, 28, 0x000).setInteractive();
            const valueText = this.add.text(600, y[i], '50', { font: '24px Arial', fill: '#cbdbfc', resolution: 2 }).setOrigin(0.5);
    
            this.contents['audio'].add(bar);
            this.contents['audio'].add(handle);
            this.contents['audio'].add(valueText);
    
            this.input.setDraggable(handle);
    
            handle.on('drag', (pointer, dragX, dragY) => {
                const newX = Phaser.Math.Clamp(dragX, bar.x - bar.width / 2, bar.x + bar.width / 2);
                handle.x = newX;
    
                const value = Phaser.Math.Percent(newX, bar.x - bar.width / 2, bar.x + bar.width / 2) * 100;
                valueText.setText(Math.round(value));
            });
        }
        this.contents['audio'].setVisible(false);
    }

    toggleVisibility(Name){
        if (this.currentVisible === Name) {return}
        this.contents[this.currentVisible].setVisible(false);
        this.contents[Name].setVisible(true);
        this.currentVisible = Name;
    }

    returnToPreviousScene(){
        this.scene.stop();
        this.scene.start(this.returnScene);
    }

}