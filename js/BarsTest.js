export default class BarsTest extends Phaser.Scene {
    constructor(){
        super("BarsTest");
    }

    init(data) {
        this.player = data.player;
    }

    create() {
        this.barHP = this.add.graphics();
        this.barStamina = this.add.graphics();
        this.barMana = this.add.graphics();
        this.barXP = this.add.graphics();

        this.barHP.fillStyle(0x73e600, 1.0);
        this.barStamina.fillStyle(0xe6e600, 1.0);
        this.barMana.fillStyle(0x0073e6, 1.0);
        this.barXP.fillStyle(0x9900FF, 1.0);

        let HP = this.player.gameState.getPlayerHP();
        let maxHP = this.player.gameState.getPlayerMaxHP();
        let stamina = this.player.gameState.getPlayerStamina();
        let maxStamina = this.player.gameState.getPlayerMaxStamina();
        let Mana = this.player.gameState.getPlayerMana();
        let maxMana = this.player.gameState.getPlayerMaxMana();
        let XP = this.player.gameState.getPlayerXP();
        let maxXP = this.player.gameState.getPlayerMaxXP();

        this.textHP = this.add.text(this.game.config.width - this.game.config.width + 53, this.game.config.height - this.game.config.height + 22.5, `${HP}/${maxHP}`, { fontFamily: 'Arial', fontSize: '16px', fill: '#000', resolution: 4 });
        this.textStamina = this.add.text(this.game.config.width - this.game.config.width + 53, this.game.config.height - this.game.config.height + 42.5, `${stamina}/${maxStamina}`, { fontFamily: 'Arial', fontSize: '16px', fill: '#000', resolution: 4 });
        this.textMana = this.add.text(this.game.config.width - this.game.config.width + 53, this.game.config.height - this.game.config.height + 62.5, `${Mana}/${maxMana}`, { fontFamily: 'Arial', fontSize: '16px', fill: '#000', resolution: 4 });
        this.textXP = this.add.text(this.game.config.width - this.game.config.width + 440, this.game.config.height - this.game.config.height + 22.5, `${XP}/${maxXP}`, { fontFamily: 'Arial', fontSize: '16px', fill: '#000', resolution: 4 });
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

        let barWidthHP = (HP / maxHP) * 100;
        let barWidthStamina = (stamina / maxStamina) * 100;
        let barWidthMana = (Mana / maxMana) * 100;
        let barWidthXP = (XP / maxXP) * 300;
        
        this.textHP.setText(`${HP}/${maxHP}`);
        this.textStamina.setText(`${stamina}/${maxStamina}`);
        this.textMana.setText(`${Mana}/${maxMana}`);
        this.textXP.setText(`${XP}/${maxXP}`);

        this.barHP.clear();
        this.barStamina.clear();
        this.barMana.clear();
        this.barXP.clear();

        this.barHP.fillStyle(0xFFFFFF, 1.0);
        this.barHP.fillRect(this.game.config.width - this.game.config.width + 30, this.game.config.height - this.game.config.height + 25, 100, 16); 
        this.barHP.fillStyle(0x73e600, 1.0);
        this.barHP.fillRect(this.game.config.width - this.game.config.width + 30, this.game.config.height - this.game.config.height + 25, barWidthHP, 16);

        this.barStamina.fillStyle(0xFFFFFF, 1.0);
        this.barStamina.fillRect(this.game.config.width - this.game.config.width + 30, this.game.config.height - this.game.config.height + 45, 100, 16);
        this.barStamina.fillStyle(0xe6e600, 1.0);
        this.barStamina.fillRect(this.game.config.width - this.game.config.width + 30, this.game.config.height - this.game.config.height + 45, barWidthStamina, 16);

        this.barMana.fillStyle(0xFFFFFF, 1.0);
        this.barMana.fillRect(this.game.config.width - this.game.config.width + 30, this.game.config.height - this.game.config.height + 65, 100, 16);
        this.barMana.fillStyle(0x0073e6, 1.0);
        this.barMana.fillRect(this.game.config.width - this.game.config.width + 30, this.game.config.height - this.game.config.height + 65, barWidthMana, 16);

        this.barXP.fillStyle(0xFFFFFF, 1.0);
        this.barXP.fillRect(this.game.config.width - this.game.config.width + 300, this.game.config.height - this.game.config.height + 25, 300, 16);
        this.barXP.fillStyle(0x9900FF, 1.0);
        this.barXP.fillRect(this.game.config.width - this.game.config.width + 300, this.game.config.height - this.game.config.height + 25, barWidthXP, 16);
    }
};