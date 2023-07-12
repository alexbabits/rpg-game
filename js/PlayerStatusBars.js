export default class PlayerStatusBars extends Phaser.Scene {
    constructor(){
        super("PlayerStatusBars");
    }

    init(data) {
        this.player = data.player;
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
            barConfig.text = this.add.text(barConfig.x + barConfig.adj, barConfig.y, `${value}/${maxValue}`, { fontFamily: 'Arial', fontSize: '16px', fill: '#000', resolution: 4 });
        });
        this.levelText = this.add.text(410, 5, `Player Level: ${this.player.gameState.getPlayerLevel()}`, { fontFamily: 'Arial', fontSize: '16px', fill: '#000',  resolution: 4 });
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