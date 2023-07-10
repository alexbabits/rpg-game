export default class BarsTest extends Phaser.Scene {
    constructor(){
        super("BarsTest");
    }

    init(data) {
        this.player = data.player;
    }

    create() {
        this.rect1 = this.add.graphics();
        this.rect1.fillStyle(0x73e600, 1.0);
        this.rect1.setDepth(500);
        let HP = this.player.gameState.getPlayerHP();
        let maxHP = this.player.gameState.getPlayerMaxHP();
        this.text1 = this.add.text(this.game.config.width - this.game.config.width + 53, this.game.config.height - this.game.config.height + 22.5, `${HP}/${maxHP}`, { fontFamily: 'Arial', fontSize: '16px', fill: '#000', resolution: 4 });
        this.text1.setDepth(500);
/////////////////////////////////////////////////////////////
        this.rect2 = this.add.graphics();
        this.rect2.fillStyle(0xe6e600, 1.0);
        this.rect2.setDepth(500);
        let stamina = this.player.gameState.getPlayerStamina();
        let maxStamina = this.player.gameState.getPlayerMaxStamina();
        this.text2 = this.add.text(this.game.config.width - this.game.config.width + 53, this.game.config.height - this.game.config.height + 42.5, `${stamina}/${maxStamina}`, { fontFamily: 'Arial', fontSize: '16px', fill: '#000', resolution: 4 });
        this.text2.setDepth(500);
/////////////////////////////////////////////////////////////
        this.rect3 = this.add.graphics();
        this.rect3.fillStyle(0x0073e6, 1.0);
        this.rect3.setDepth(500);
        let Mana = this.player.gameState.getPlayerMana();
        let maxMana = this.player.gameState.getPlayerMaxMana();
        this.text3 = this.add.text(this.game.config.width - this.game.config.width + 53, this.game.config.height - this.game.config.height + 62.5, `${Mana}/${maxMana}`, { fontFamily: 'Arial', fontSize: '16px', fill: '#000', resolution: 4 });
        this.text3.setDepth(500);
////////////////////////////////////////////////////////////
        this.rect4 = this.add.graphics();
        this.rect4.fillStyle(0x9900FF, 1.0);
        this.rect4.setDepth(500);
        let XP = this.player.gameState.getPlayerXP();
        let maxXP = this.player.gameState.getPlayerMaxXP();
        this.text4 = this.add.text(this.game.config.width - this.game.config.width + 440, this.game.config.height - this.game.config.height + 22.5, `${XP}/${maxXP}`, { fontFamily: 'Arial', fontSize: '16px', fill: '#000', resolution: 4 });
        this.text4.setDepth(500);
    }

    update() {
        let HP = this.player.gameState.getPlayerHP();
        let maxHP = this.player.gameState.getPlayerMaxHP();
        let stamina = this.player.gameState.getPlayerStamina();
        let maxStamina = this.player.gameState.getPlayerMaxStamina();
        let Mana = this.player.gameState.getPlayerMana();
        let maxMana = this.player.gameState.getPlayerMaxMana();
        let XP = this.player.gameState.getPlayerXP();
        let maxXP = this.player.gameState.getPlayerMaxXP();
        
        this.text1.setText(`${HP}/${maxHP}`);
        this.text2.setText(`${stamina}/${maxStamina}`);
        this.text3.setText(`${Mana}/${maxMana}`);
        this.text4.setText(`${XP}/${maxXP}`);

        this.rect1.clear();
        this.rect1.fillStyle(0xFFFFFF, 1.0);
        this.rect1.fillRect(this.game.config.width - this.game.config.width + 30, this.game.config.height - this.game.config.height + 25, 100, 16);
        this.rect1.fillStyle(0x73e600, 1.0);
        let barWidth1 = (HP / maxHP) * 100;
        this.rect1.fillRect(this.game.config.width - this.game.config.width + 30, this.game.config.height - this.game.config.height + 25, barWidth1, 16);
        
        this.rect2.clear();
        this.rect2.fillStyle(0xFFFFFF, 1.0);
        this.rect2.fillRect(this.game.config.width - this.game.config.width + 30, this.game.config.height - this.game.config.height + 45, 100, 16);
        this.rect2.fillStyle(0xe6e600, 1.0);
        let barWidth2 = (stamina / maxStamina) * 100;
        this.rect2.fillRect(this.game.config.width - this.game.config.width + 30, this.game.config.height - this.game.config.height + 45, barWidth2, 16);

        this.rect3.clear();
        this.rect3.fillStyle(0xFFFFFF, 1.0);
        this.rect3.fillRect(this.game.config.width - this.game.config.width + 30, this.game.config.height - this.game.config.height + 65, 100, 16);
        this.rect3.fillStyle(0x0073e6, 1.0);
        let barWidth3 = (Mana / maxMana) * 100;
        this.rect3.fillRect(this.game.config.width - this.game.config.width + 30, this.game.config.height - this.game.config.height + 65, barWidth3, 16);

        this.rect4.clear();
        this.rect4.fillStyle(0xFFFFFF, 1.0);
        this.rect4.fillRect(this.game.config.width - this.game.config.width + 300, this.game.config.height - this.game.config.height + 25, 300, 16);
        this.rect4.fillStyle(0x9900FF, 1.0);
        let barWidth4 = (XP / maxXP) * 300;
        this.rect4.fillRect(this.game.config.width - this.game.config.width + 300, this.game.config.height - this.game.config.height + 25, barWidth4, 16);
    }
};