export default class PlayerStatusBars extends Phaser.Scene {
    constructor(){
        super("PlayerStatusBars");
    }

    preload() {
        this.load.bitmapFont('Font', 'assets/images/Font.png', 'assets/images/Font.fnt');
    }

    init(data) {
        this.player = data.player;
        this.container = data.container;
    }

    create() {   
        this.barsConfig = [
            {color: 0x73e600, x: 53, y: 22.5, width: 100, adj: 20, getValue: () => this.player.gameState.getPlayerHP(), getMaxValue: () => this.player.gameState.getPlayerMaxHP(), getColor: (value, maxValue) => value <= maxValue / 4 ? 0xFF0000 : 0x73e600},
            {color: 0xe6e600, x: 53, y: 42.5, width: 100, adj: 20, getValue: () => this.player.gameState.getPlayerStamina(), getMaxValue: () => this.player.gameState.getPlayerMaxStamina()},
            {color: 0x0073e6, x: 53, y: 62.5, width: 100, adj: 25, getValue: () => this.player.gameState.getPlayerMana(), getMaxValue: () => this.player.gameState.getPlayerMaxMana()},
            {color: 0x9900FF, x: 300, y: 22.5, width: 300, adj: 135, getValue: () => this.player.gameState.getPlayerXP(), getMaxValue: () => this.player.gameState.getPlayerMaxXP()}
        ];

        this.barsConfig.forEach(barConfig => {
            let value = barConfig.getValue();
            let maxValue = barConfig.getMaxValue();
            barConfig.bar = this.add.graphics();
            barConfig.bar.fillStyle(barConfig.color, 1.0);
            barConfig.text = this.add.bitmapText(barConfig.x + barConfig.adj, barConfig.y, 'Font', `${value}/${maxValue}`, 16).setTint(0x000);

        });
        this.levelText = this.add.bitmapText(410, 5, 'Font', `Player Level: ${this.player.gameState.getPlayerLevel()}`, 16).setTint(0x000);

        // Event listeners for player related attribute changes (hitsplats, xp drops, etc.)
        this.events.on('xpGained', (monsterXP) => {
            const xpDropText = this.add.text(530, 40, `+${monsterXP} XP`, {fontSize: '20px', fontFamily: 'Arial', fill: '#9900FF', resolution: 2});
            this.tweens.add({targets: xpDropText, y: xpDropText.y + 80, alpha: 0, duration: 1200, ease: 'Linear',
              onComplete: () => {
                xpDropText.destroy();
              }
            });
          });

        this.events.on('damageTaken', (netDamage) => {
            const posX = this.player.sprite.x;
            const posY = this.player.sprite.y;
            const hitSplat = this.add.graphics({ x: 0, y: 0 });
            hitSplat.fillStyle(0xff0000).fillCircle(0, 0, 7);

            const damageText = this.add.text(0, 0, `${netDamage}`, {fontSize: '10px', fontFamily: 'Arial', fill: '#FFF', resolution: 2}).setOrigin(0.5,0.5);
            this.container.add([hitSplat, damageText]).setPosition(posX, posY).setDepth(10);
            this.tweens.add({targets: [damageText, hitSplat], alpha: 0, duration: 1000,
                onComplete: () => {
                    damageText.destroy();
                    hitSplat.destroy();
                }
            });
        });

        this.events.on('potionSplat', (amount, color) => {
            const posX = this.player.sprite.x;
            const posY = this.player.sprite.y;
            const text = this.add.text(-2, -30, `+${amount}`, {fontSize: '14px', fontFamily: 'Arial', fill: color, resolution: 2}).setOrigin(0.5, 0.5);
            this.container.add([text]).setPosition(posX, posY).setDepth(10);
            this.tweens.add({targets: text, alpha: 0, duration: 1000, onComplete: () => {
                text.destroy();
            }});
        });

    }

    update() {
        this.barsConfig.forEach(barConfig => {
            let value = barConfig.getValue();
            let maxValue = barConfig.getMaxValue();
            let barWidth = (value / maxValue) * barConfig.width;
    
            barConfig.text.setText(`${value}/${maxValue}`);
    
            barConfig.bar.clear();
            barConfig.bar.fillStyle(0xFFFFFF, 1.0);
            barConfig.bar.fillRect(barConfig.x, barConfig.y, barConfig.width, 16);
            barConfig.bar.fillStyle(barConfig.getColor ? barConfig.getColor(value, maxValue) : barConfig.color, 1.0);
            barConfig.bar.fillRect(barConfig.x, barConfig.y, barWidth, 16);
        });
        this.levelText.setText(`Player Level: ${this.player.gameState.getPlayerLevel()}`);
    }
};