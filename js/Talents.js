export default class Talents extends Phaser.Scene {
    constructor() {
        super("Talents");
    }

    init(data) {
        this.gameState = data.gameState;
    }

    create() {
        this.background = this.add.sprite(150, 250, 'brownbackground').setScale(3.4, 3);
        this.setupTalentsIcon();
        this.setupExitButton();
        this.setupPlusButtons();
        this.createText();
        this.setVisibility(this.gameState.getTalentsVisibility());
        this.input.keyboard.on('keydown-T', () => {this.toggleVisibility()});
    }

    toggleVisibility() {
        const newVisibility = !this.gameState.getTalentsVisibility();
        this.gameState.setTalentsVisibility(newVisibility);
        this.setVisibility(newVisibility);
    }

    setVisibility(visible){
        if (this.background) {this.background.setVisible(visible)}
        if (this.exitButton) {this.exitButton.setVisible(visible)}
        if (this.strengthPlusButton) {this.strengthPlusButton.setVisible(visible)}
        if (this.strengthText) {this.strengthText.setVisible(visible)}
        if (this.agilityText) {this.agilityText.setVisible(visible)}
        if (this.intelligenceText) {this.intelligenceText.setVisible(visible)}
        if (this.vitalityText) {this.vitalityText.setVisible(visible)}
        if (this.enduranceText) {this.enduranceText.setVisible(visible)}
        if (this.wisdomText) {this.wisdomText.setVisible(visible)}
        if (this.critChanceText) {this.critChanceText.setVisible(visible)}
        if (this.critDamageText) {this.critDamageText.setVisible(visible)}
        if (this.statPointsText) {this.statPointsText.setVisible(visible)}
        if (this.levelText) {this.levelText.setVisible(visible)}
    }

    createText(){
        this.levelText = this.add.text(50, 140, '', { font: '16px Arial', fill: '#000', resolution: 2 });
        this.statPointsText = this.add.text(160, 140, '', { font: '16px Arial', fill: '#000', resolution: 2 });
        this.strengthText = this.add.text(50, 170, '', { font: '16px Arial', fill: '#000', resolution: 2 });
        this.agilityText = this.add.text(50, 190, '', { font: '16px Arial', fill: '#000', resolution: 2 });
        this.intelligenceText = this.add.text(50, 210, '', { font: '16px Arial', fill: '#000', resolution: 2 });
        this.vitalityText = this.add.text(50, 230, '', { font: '16px Arial', fill: '#000', resolution: 2 });
        this.enduranceText = this.add.text(50, 250, '', { font: '16px Arial', fill: '#000', resolution: 2 });
        this.wisdomText = this.add.text(50, 270, '', { font: '16px Arial', fill: '#000', resolution: 2 });
        this.critChanceText = this.add.text(50, 310, '', { font: '16px Arial', fill: '#000', resolution: 2 });
        this.critDamageText = this.add.text(50, 330, '', { font: '16px Arial', fill: '#000', resolution: 2 });
    }

    setupExitButton() {
        this.exitButton = this.add.sprite(15, 130, 'items', 12).setScale(0.65).setDepth(200).setInteractive();
        this.exitButton.on('pointerover', () => {this.exitButton.setTint(0x969696)});
        this.exitButton.on('pointerout', () => {this.exitButton.clearTint()});
        this.exitButton.on('pointerdown', () => {this.toggleVisibility()});
    }

    setupPlusButtons() {
        this.strengthPlusButton = this.add.sprite(40, 180, 'items', 13).setScale(0.5).setDepth(200).setInteractive();
        this.strengthPlusButton.on('pointerover', () => {this.strengthPlusButton.setTint(0x969696)});
        this.strengthPlusButton.on('pointerout', () => {this.strengthPlusButton.clearTint()});
        this.strengthPlusButton.on('pointerdown', () => {this.increaseStrength()});
    }

    increaseStrength(){
        this.gameState.setPlayerStatPoints(this.gameState.getPlayerStatPoints() - 1)
        this.gameState.setPlayerStrength(this.gameState.getPlayerStrength() + 1)
    }

    setupTalentsIcon() {
        this.talentsIcon = this.add.sprite(145, 603, 'items', 213).setScale(1.5).setDepth(200).setInteractive();
        this.talentsIcon.on('pointerover', () => {this.talentsIcon.setTint(0x969696)});
        this.talentsIcon.on('pointerout', () => {this.talentsIcon.clearTint()});
        this.talentsIcon.on('pointerdown', () => {this.toggleVisibility()});
    }

    updateText(){
        this.strengthText.setText(`Strength: ${this.gameState.getPlayerStrength()}`);
        this.agilityText.setText(`Agility: ${this.gameState.getPlayerAgility()}`);
        this.intelligenceText.setText(`Intelligence: ${this.gameState.getPlayerIntelligence()}`);
        this.vitalityText.setText(`Vitality: ${this.gameState.getPlayerVitality()}`);
        this.enduranceText.setText(`Endurance: ${this.gameState.getPlayerEndurance()}`);
        this.wisdomText.setText(`Wisdom: ${this.gameState.getPlayerWisdom()}`);
        this.critChanceText.setText(`Crit Chance: ${this.gameState.getPlayerCritChance()}%`);
        this.critDamageText.setText(`Crit Damage: ${this.gameState.getPlayerCritDamage()}%`);
        this.statPointsText.setText(`Stat Points: ${this.gameState.getPlayerStatPoints()}`);
        this.levelText.setText(`Level: ${this.gameState.getPlayerLevel()}`);
    }

    updateButtons(){
        if(this.gameState.getPlayerStatPoints() === 0){this.strengthPlusButton.setVisible(false)}
    }

    update(){
        this.updateText();
        this.updateButtons();
    }

}