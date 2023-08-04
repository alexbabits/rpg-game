export default class Journal extends Phaser.Scene{

    constructor(){
        super("Journal");
    }

    create(data) {
        this.gameState = data.gameState;
        this.inventoryVisible = data.inventoryVisible;
        this.equipmentVisible = data.equipmentVisible;
        this.input.keyboard.on('keydown-J', this.closeJournal, this);
        this.input.keyboard.on('keydown-ESC', this.closeJournal, this);
        this.createBackground();
        this.createExitButton();
        this.createQuestButton();
        this.createStatsButton();
        this.createQuestData();
        this.createStatsData();
        this.questTexts.forEach(text => text.setVisible(false));
        this.statsTexts.forEach(text => text.setVisible(false));
        //this.add.text(320, 320, `${this.gameState.getPlayerMonsterKills()}`, { font: '24px Arial', fill: '#000', resolution: 2 }).setOrigin(0.5, 0.5);
    }

    createBackground(){
        this.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'brownbackground').setScale(6, 4);
        this.add.sprite(378, 320, 'items', 11).setScale(11.5, 10).setOrigin(0.5,0.5);
        this.add.text(380, 200,'Kingdom of Razion', { font: '24px Arial', fill: '#000', resolution: 2 }).setOrigin(0.5, 0.5);
    }

    createQuestData() {
        this.QuestStatus1 = 'In Progress. Go to the goblin hut.'
        this.QuestStatus2 = 'Completed.'
        this.QuestStatus3 = 'Have not started.'
        this.questTexts = [
            this.add.text(230, 260, `Quest 1: ${this.QuestStatus1}`, { font: '16px Arial', fill: '#000', resolution: 2 }),
            this.add.text(230, 300, `Quest 2: ${this.QuestStatus2}`, { font: '16px Arial', fill: '#000', resolution: 2 }),
            this.add.text(230, 340, `Quest 3: ${this.QuestStatus3}`, { font: '16px Arial', fill: '#000', resolution: 2 })
        ];
    }

    createStatsData() {
        this.currentLevel = this.gameState.getPlayerLevel();
        this.totalXPGained = this.gameState.getPlayerTotalXP();
        this.monstersKilled = this.gameState.getPlayerMonsterKills();
        this.bossesSlain = '0'
        this.timePlayed = `69 minutes`
        this.statsTexts = [
            this.add.text(230, 230, `Current Level: ${this.currentLevel}`, { font: '16px Arial', fill: '#000', resolution: 2 }),
            this.add.text(230, 270, `Total XP Gained: ${this.totalXPGained}`, { font: '16px Arial', fill: '#000', resolution: 2 }),
            this.add.text(230, 310, `Monsters Killed: ${this.monstersKilled}`, { font: '16px Arial', fill: '#000', resolution: 2 }),
            this.add.text(230, 350, `Bosses Slain: ${this.bossesSlain}`, { font: '16px Arial', fill: '#000', resolution: 2 }),
            this.add.text(230, 390, `Time Played: ${this.timePlayed}`, { font: '16px Arial', fill: '#000', resolution: 2 })
        ];
    }

    createQuestButton() {
        const buttonSprite = this.add.sprite(140, 220, 'items', 11).setScale(3.0, 1).setInteractive();
        buttonSprite.on('pointerover', () => {buttonSprite.setTint(0x9e733f);});
        buttonSprite.on('pointerout', () => {buttonSprite.clearTint();});
        buttonSprite.on('pointerdown', () => {this.toggleTextsVisibility(true)});
        
        const buttonText = this.add.text(140, 220, 'Quests', { font: '16px Arial', fill: '#000', resolution: 2 }).setOrigin(0.5, 0.5);
        this.add.container(0, 0, [buttonSprite, buttonText]);
    }
    
    createStatsButton() {
        const buttonSprite = this.add.sprite(140, 260, 'items', 11).setScale(3.0, 1).setInteractive();
        buttonSprite.on('pointerover', () => {buttonSprite.setTint(0x9e733f);});
        buttonSprite.on('pointerout', () => {buttonSprite.clearTint();});
        buttonSprite.on('pointerdown', () => {this.toggleTextsVisibility(false)});
        
        const buttonText = this.add.text(140, 260, 'Stats', { font: '16px Arial', fill: '#000', resolution: 2 }).setOrigin(0.5, 0.5);
        this.add.container(0, 0, [buttonSprite, buttonText]);
    }

    toggleTextsVisibility(showQuests) {
        this.questTexts.forEach(text => text.setVisible(showQuests));
        this.statsTexts.forEach(text => text.setVisible(!showQuests));
    }

    createExitButton() {
        let exitButton = this.add.sprite(80, 160, 'items', 12).setScale(0.65).setDepth(200).setInteractive();
        exitButton.on('pointerover', () => {exitButton.setTint(0x969696)}); 
        exitButton.on('pointerout', () => {exitButton.clearTint()});
        exitButton.on('pointerdown', () => this.closeJournal());
    }

    closeJournal() {
        this.scene.stop();
        let inventoryDisplay = this.scene.get('InventoryDisplay');
        let equipmentDisplay = this.scene.get('EquipmentDisplay');
        this.scene.resume(this.gameState.getCurrentMap());
        this.scene.resume('InventoryDisplay');
        this.scene.resume('EquipmentDisplay');
    
        if (this.inventoryVisible) {inventoryDisplay.toggleVisibility()}
        if (this.equipmentVisible) {equipmentDisplay.toggleVisibility()}
    }

}