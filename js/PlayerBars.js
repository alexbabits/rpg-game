export class HPBar {
    constructor(scene, x, y, player) {
        this.scene = scene;
        this.player = player;
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.text = new Phaser.GameObjects.Text(scene, 130, 108, '', { fontFamily: 'Courier', fontSize: '11px', fill: '#000', resolution: 2 });
        this.bar.setDepth(50);
        this.text.setDepth(51);
        this.bar.setScrollFactor(0, 0);
        this.text.setScrollFactor(0, 0);
        this.x = x;
        this.y = y;
        this.size = {width: 77, height: 10};
        scene.add.existing(this.bar);
        scene.add.existing(this.text);
        this.draw();
    };

    draw() {
        this.bar.clear();
        this.pixelPerHP = this.size.width / this.player.maxHP;
        this.text.setText(`${this.player.HP}/${this.player.maxHP}`);

        const { width, height } = this.size;
        const HPWidth = this.player.HP * this.pixelPerHP;
        this.bar.fillStyle(0xFFFFFF);
        this.bar.fillRect(this.x, this.y, width, height);

        if (HPWidth <= this.size.width / 4) {
            this.bar.fillStyle(0xFF0000);
        } else {
            this.bar.fillStyle(0x73e600);
        }
        if (HPWidth > 0) {
            this.bar.fillRect(this.x, this.y, HPWidth, height);
        }
    };
}


export class StaminaBar {
    constructor(scene, x, y, player) {
        this.scene = scene;
        this.player = player;
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.text = new Phaser.GameObjects.Text(scene, 130, 123, '', { fontFamily: 'Courier', fontSize: '11px', fill: '#000', resolution: 2 });
        this.bar.setDepth(50);
        this.text.setDepth(51);
        this.bar.setScrollFactor(0, 0);
        this.text.setScrollFactor(0, 0);
        this.x = x;
        this.y = y;
        this.size = {width: 77, height: 10};
        scene.add.existing(this.bar);
        scene.add.existing(this.text);
        this.draw();
    };

    draw() {
        this.bar.clear();
        this.pixelPerStamina = this.size.width / this.player.maxStamina;
        this.text.setText(`${this.player.stamina}/${this.player.maxStamina}`);

        const { width, height } = this.size;
        const staminaWidth = this.player.stamina * this.pixelPerStamina;
        this.bar.fillStyle(0xFFFFFF);
        this.bar.fillRect(this.x, this.y, width, height);
        this.bar.fillStyle(0xe6e600);

        if (staminaWidth > 0) {
            this.bar.fillRect(this.x, this.y, staminaWidth, height);
        }
    };
}


export class ManaBar {
    constructor(scene, x, y, player) {
        this.scene = scene;
        this.player = player;
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.text = new Phaser.GameObjects.Text(scene, 130, 138, '', { fontFamily: 'Courier', fontSize: '11px', fill: '#000', resolution: 2 });
        this.bar.setDepth(50);
        this.text.setDepth(51);
        this.bar.setScrollFactor(0, 0);
        this.text.setScrollFactor(0, 0);
        this.x = x;
        this.y = y;
        this.size = {width: 77, height: 10};
        scene.add.existing(this.bar);
        scene.add.existing(this.text);
        this.draw();
    };

    draw() {
        this.bar.clear();
        this.pixelPerMana = this.size.width / this.player.maxMana;
        this.text.setText(`${this.player.mana}/${this.player.maxMana}`);

        const { width, height } = this.size;
        const manaWidth = this.player.mana * this.pixelPerMana;
        this.bar.fillStyle(0xFFFFFF);
        this.bar.fillRect(this.x, this.y, width, height);
        this.bar.fillStyle(0x0073e6);

        if (manaWidth > 0) {
            this.bar.fillRect(this.x, this.y, manaWidth, height);
        }
    };
}


export class XPBar {
    constructor(scene, x, y, player) {
        this.scene = scene;
        this.player = player;
        scene.events.on('xpChange', this.draw, this);
        scene.events.on('levelUp', this.draw, this);
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.text = new Phaser.GameObjects.Text(scene, 420, 108, '', { fontFamily: 'Courier', fontSize: '11px', fill: '#000', resolution: 2 });
        this.bar.setDepth(50);
        this.text.setDepth(51);
        this.bar.setScrollFactor(0, 0);
        this.text.setScrollFactor(0, 0);
        this.x = x;
        this.y = y;
        this.size = {width: 200, height: 10};
        scene.add.existing(this.bar);
        scene.add.existing(this.text);
        this.draw();
    };

    draw() {
        this.bar.clear();
        this.pixelPerXP = this.size.width / this.player.maxXP;
        this.text.setText(`${this.player.XP}/${this.player.maxXP}`);

        const { width, height } = this.size;
        const XPWidth = this.player.XP * this.pixelPerXP;
        this.bar.fillStyle(0xFFFFFF);
        this.bar.fillRect(this.x, this.y, width, height);
        this.bar.fillStyle(0x7300e6);

        if (XPWidth > 0) {
            this.bar.fillRect(this.x, this.y, XPWidth, height);
        }
    };
}