/*
export class Bar {
    constructor(scene, player, barWidth, barHeight, barX, barY, textX, textY, fontSize, color) {
        this.scene = scene;
        this.player = player;
        this.color = color;
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.text = new Phaser.GameObjects.Text(scene, textX, textY, '', { fontFamily: 'Arial', fontSize: `${fontSize}px`, fill: '#000', resolution: 2 });
        this.bar.setDepth(50);
        this.text.setDepth(51);
        this.bar.setScrollFactor(0, 0);
        this.text.setScrollFactor(0, 0);
        this.barX = barX;
        this.barY = barY;
        this.size = {barWidth, barHeight};
        scene.add.existing(this.bar);
        scene.add.existing(this.text);
    }

    draw(value, maxValue, color) {
        this.bar.clear();
        this.pixelPerValue = this.size.barWidth / maxValue;
        this.text.setText(`${value}/${maxValue}`);
        const { barWidth, barHeight } = this.size;
        const valueWidth = value * this.pixelPerValue;
        this.bar.fillStyle(0xFFFFFF);
        this.bar.fillRect(this.barX, this.barY, barWidth, barHeight);
        this.bar.fillStyle(color || this.color);
    
        if (valueWidth > 0) {
            this.bar.fillRect(this.barX, this.barY, valueWidth, barHeight);
        }
    }
}

export class HPBar extends Bar {
    constructor(scene, player) {super(scene, player, 77, 10, 112, 110, 130, 108, 11, 0x73e600)}
    draw() {
        let color = this.color;
        if (this.player.gameState.getPlayerHP() <= this.player.gameState.getPlayerMaxHP() / 4) {
            color = 0xFF0000;
        }
        super.draw(this.player.gameState.getPlayerHP(), this.player.gameState.getPlayerMaxHP(), color);
    }
}

export class XPBar extends Bar {
    constructor(scene, player) {super(scene, player, 200, 10, 332, 110, 420, 108, 11, 0x9900FF)}
    draw() {super.draw(this.player.gameState.getPlayerXP(), this.player.gameState.getPlayerMaxXP(), this.color);}
}

export class StaminaBar extends Bar {
    constructor(scene, player) {super(scene, player, 77, 10, 112, 125, 130, 123, 11, 0xe6e600)}
    draw() {super.draw(this.player.gameState.getPlayerStamina(), this.player.gameState.getPlayerMaxStamina(), this.color);}
}

export class ManaBar extends Bar {
    constructor(scene, player) {super(scene, player, 77, 10, 112, 140, 130, 138, 11, 0x0073e6)}
    draw() {super.draw(this.player.gameState.getPlayerMana(), this.player.gameState.getPlayerMaxMana(), this.color);}
}

*/