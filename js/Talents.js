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

    setVisibility(visible) {
        const elements = ['background', 'exitButton', 'strengthPlusButton', 'agilityPlusButton', 'intelligencePlusButton', 'vitalityPlusButton', 'endurancePlusButton', 'wisdomPlusButton', 'strengthText', 'agilityText', 'intelligenceText', 'vitalityText', 'enduranceText', 'wisdomText', 'critChanceText', 'critDamageText', 'statPointsText', 'levelText'];
    
        for (let i = 0; i < elements.length; i++){
            if (this[elements[i]]){
                this[elements[i]].setVisible(visible);
            }
        }
    }

    createText() {
        const yPositions = [140, 140, 170, 190, 210, 230, 250, 270, 310, 330];
        const xPositions = [50, 160, 50, 50, 50, 50, 50, 50, 50, 50];
        const elements = ['level', 'statPoints', 'strength', 'agility', 'intelligence', 'vitality', 'endurance', 'wisdom', 'critChance', 'critDamage'];
    
        for (let i = 0; i < elements.length; i++){
            this[`${elements[i]}Text`] = this.add.text(xPositions[i], yPositions[i], '', { font: '16px Arial', fill: '#000', resolution: 2 });
        }
    }

    setupExitButton() {
        this.exitButton = this.add.sprite(15, 130, 'items', 12).setScale(0.65).setDepth(200).setInteractive();
        this.exitButton.on('pointerover', () => {this.exitButton.setTint(0x969696)});
        this.exitButton.on('pointerout', () => {this.exitButton.clearTint()});
        this.exitButton.on('pointerdown', () => {this.toggleVisibility()});
    }

    setupPlusButtons() {
        const lowercaseStats = ['strength', 'agility', 'intelligence', 'vitality', 'endurance', 'wisdom'];
        const uppercaseStats = ['Strength', 'Agility', 'Intelligence', 'Vitality', 'Endurance', 'Wisdom'];
    
        for (let i = 0; i < lowercaseStats.length; i++) {
            const y = 180 + (20 * i);
            this[`${lowercaseStats[i]}PlusButton`] = this.add.sprite(40, y, 'items', 13).setScale(0.5).setDepth(200).setInteractive();
            this[`${lowercaseStats[i]}PlusButton`].on('pointerover', () => { this[`${lowercaseStats[i]}PlusButton`].setTint(0x969696) });
            this[`${lowercaseStats[i]}PlusButton`].on('pointerout', () => { this[`${lowercaseStats[i]}PlusButton`].clearTint() });
            this[`${lowercaseStats[i]}PlusButton`].on('pointerdown', () => { this.increaseStat(uppercaseStats[i]) });
        }
    }
    
    increaseStat(stat) {
        this.gameState.setPlayerStatPoints(this.gameState.getPlayerStatPoints() - 1);
        this.gameState[`setPlayer${stat}`](this.gameState[`getPlayer${stat}`]() + 1);
    }

    setupTalentsIcon() {
        this.talentsIcon = this.add.sprite(145, 603, 'items', 213).setScale(1.5).setDepth(200).setInteractive();
        this.talentsIcon.on('pointerover', () => {this.talentsIcon.setTint(0x969696)});
        this.talentsIcon.on('pointerout', () => {this.talentsIcon.clearTint()});
        this.talentsIcon.on('pointerdown', () => {this.toggleVisibility()});
    }

    updateText() {
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

    updateButtons() {
        const stats = ['strength', 'agility', 'intelligence', 'vitality', 'endurance', 'wisdom'];
        
        for (let i = 0; i < stats.length; i++) {
            if(this.gameState.getPlayerStatPoints() === 0 || !this.background.visible){
                this[`${stats[i]}PlusButton`].setVisible(false);
            } else {
                this[`${stats[i]}PlusButton`].setVisible(true);
            }
        }
    }

    update() {
        this.updateText();
        this.updateButtons();
    }

}